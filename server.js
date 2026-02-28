try {
  require('dotenv').config();
} catch (err) {
  // Only ignore if the module truly isn't installed — rethrow other errors.
  if (!err || err.code !== 'MODULE_NOT_FOUND') throw err;
}

const express = require('express');
const session = require('express-session');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const FileStore = require('session-file-store')(session);

const app = express();

// Security / proxy settings
// When running behind a proxy (e.g., in production), trust the first proxy so
// secure cookies work correctly and client IPs are set on req.ip.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Hide X-Powered-By header for slightly better security posture
app.disable('x-powered-by');

// Basic security headers to improve security posture
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  // Content Security Policy: conservative defaults; adjust as UI/resources evolve
  res.setHeader(Content-Security-Policy, "default-src self https: data:; script-src self unsafe-inline https:; style-src self unsafe-inline https:; img-src self data:; connect-src self https://www.googleapis.com https://*.googleapis.com; frame-ancestors none");
  next();
});

const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// OAuth2 client
function createOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${BASE_URL}/auth/callback`
  );
}

// Session middleware
// Ensure sessions directory exists for file-based session store
const SESSIONS_DIR = path.join(__dirname, 'sessions');
if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
  store: new FileStore({ path: SESSIONS_DIR, ttl: 7*24*60*60, logFn: function(){} }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Auth middleware
async function requireAuth(req, res, next) {
  if (!req.session.tokens) {
    return res.redirect('/login');
  }
  // Try to refresh tokens if expired
  const tokens = await refreshTokensIfNeeded(req.session);
  if (!tokens) {
    req.session.destroy(() => {
      res.redirect('/login?error=token_refresh_failed');
    });
    return;
  }
  next();
}

// Helper: refresh expired tokens if needed
async function refreshTokensIfNeeded(session) {
  if (!session.tokens) return null;

  const { expiry_date, refresh_token } = session.tokens;
  const now = Date.now();

  // If token will expire in the next 5 minutes, refresh it
  if (expiry_date && expiry_date - now < 5 * 60 * 1000) {
    try {
      const oauth2Client = createOAuthClient();
      oauth2Client.setCredentials(session.tokens);

      // Older googleapis helper
      if (typeof oauth2Client.refreshAccessToken === 'function') {
        const refreshed = await oauth2Client.refreshAccessToken();
        const credentials = refreshed && refreshed.credentials ? refreshed.credentials : refreshed;
        session.tokens = credentials;
        return credentials;
      }

      // Newer googleapis - calling getAccessToken may trigger an automatic refresh
      if (typeof oauth2Client.getAccessToken === 'function') {
        await oauth2Client.getAccessToken();
        const credentials = oauth2Client.credentials || session.tokens;
        session.tokens = credentials;
        return credentials;
      }

      // Fallback: if refresh_token is available try refreshToken
      if (refresh_token && typeof oauth2Client.refreshToken === 'function') {
        const refreshed = await oauth2Client.refreshToken(refresh_token);
        const credentials = refreshed && refreshed.credentials ? refreshed.credentials : refreshed;
        session.tokens = credentials;
        return credentials;
      }

      return null;
    } catch (err) {
      console.error('Token refresh failed:', err);
      return null;
    }
  }

  return session.tokens;
}

// Helper: get authenticated Tasks client
function getTasksClient(tokens) {
  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials(tokens);
  return google.tasks({ version: 'v1', auth: oauth2Client });
}

// Helper: handle API errors and check for auth failures
function handleApiError(err, req, res) {
  // Normalize different error shapes from googleapis / http libs
  function extractStatus(e) {
    if (!e) return null;
    if (typeof e.status === 'number') return e.status;
    if (typeof e.statusCode === 'number') return e.statusCode;
    // Some googleapis errors include a response object
    if (e.response && typeof e.response.status === 'number') return e.response.status;
    // Axios-style error may have status on e.response.status
    if (e.code && typeof e.code === 'number') return e.code;
    return null;
  }

  const status = extractStatus(err);
  // Log full error for debugging
  console.error('API error:', err && (err.message || err));

  if (status === 401) {
    // Token is revoked or invalid
    try {
      req.session && req.session.destroy && req.session.destroy(() => {});
    } catch (e) {}
    // If this is an HTML route redirect, prefer redirect; otherwise JSON
    if (req && req.headers && req.headers.accept && req.headers.accept.indexOf('text/html') !== -1) {
      res.redirect('/login?error=auth_required');
    } else {
      res.status(401).json({ error: 'Authentication failed. Please sign in again.' });
    }
    return true;
  }
  if (status === 403) {
    console.error('Permission denied (403)');
    res.status(403).json({ error: 'Permission denied' });
    return true;
  }
  return false;
}


// ─── Auth routes ────────────────────────────────────────────────────────────

app.get('/login', (req, res) => {
  if (req.session.tokens) return res.redirect('/');
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/auth/google', (req, res) => {
  const oauth2Client = createOAuthClient();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/userinfo.profile'],
    prompt: 'consent',
  });
  res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) {
    return res.redirect('/login?error=access_denied');
  }
  try {
    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    req.session.tokens = tokens;

    // Get user info
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();
    req.session.user = { name: userInfo.name, picture: userInfo.picture };

    res.redirect('/');
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.redirect('/login?error=auth_failed');
  }
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ─── App routes ─────────────────────────────────────────────────────────────

app.get('/', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// ─── API: Task lists ─────────────────────────────────────────────────────────

app.get('/api/tasklists', requireAuth, async (req, res) => {
  try {
    const tasks = getTasksClient(req.session.tokens);
    const { data } = await tasks.tasklists.list({ maxResults: 100 });
    res.json(data.items || []);
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error fetching task lists:', err.message);
    res.status(500).json({ error: 'Failed to fetch task lists' });
  }
});

app.post('/api/tasklists', requireAuth, async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const tasks = getTasksClient(req.session.tokens);
    const { data } = await tasks.tasklists.insert({
      requestBody: { title: title.trim() },
    });
    res.status(201).json(data);
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error creating task list:', err.message);
    res.status(500).json({ error: 'Failed to create task list' });
  }
});

app.patch('/api/tasklists/:listId', requireAuth, async (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const tasks = getTasksClient(req.session.tokens);
    const { data } = await tasks.tasklists.patch({
      tasklist: req.params.listId,
      requestBody: { title: title.trim() },
    });
    res.json(data);
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error renaming task list:', err.message);
    res.status(500).json({ error: 'Failed to rename task list' });
  }
});

app.delete('/api/tasklists/:listId', requireAuth, async (req, res) => {
  try {
    const tasks = getTasksClient(req.session.tokens);
    await tasks.tasklists.delete({ tasklist: req.params.listId });
    res.status(204).end();
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error deleting task list:', err.message);
    res.status(500).json({ error: 'Failed to delete task list' });
  }
});

// ─── API: Tasks ──────────────────────────────────────────────────────────────

app.get('/api/tasklists/:listId/tasks', requireAuth, async (req, res) => {
  try {
    const tasks = getTasksClient(req.session.tokens);
    const { data } = await tasks.tasks.list({
      tasklist: req.params.listId,
      showCompleted: true,
      showHidden: false,
      maxResults: 100,
    });
    res.json(data.items || []);
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error fetching tasks:', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasklists/:listId/tasks', requireAuth, async (req, res) => {
  const { title, notes, due } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  try {
    const tasks = getTasksClient(req.session.tokens);
    const requestBody = { title: title.trim() };
    if (notes) requestBody.notes = notes;
    if (due) requestBody.due = new Date(due).toISOString();

    const { data } = await tasks.tasks.insert({
      tasklist: req.params.listId,
      requestBody,
    });
    res.status(201).json(data);
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error creating task:', err.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.patch('/api/tasklists/:listId/tasks/:taskId', requireAuth, async (req, res) => {
  const { title, notes, due, status } = req.body;
  try {
    const tasks = getTasksClient(req.session.tokens);
    const requestBody = {};
    if (title !== undefined) requestBody.title = title.trim();
    if (notes !== undefined) requestBody.notes = notes;
    if (due !== undefined) requestBody.due = due ? new Date(due).toISOString() : null;
    if (status !== undefined) requestBody.status = status;

    const { data } = await tasks.tasks.patch({
      tasklist: req.params.listId,
      task: req.params.taskId,
      requestBody,
    });
    res.json(data);
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error updating task:', err.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/tasklists/:listId/tasks/:taskId', requireAuth, async (req, res) => {
  try {
    const tasks = getTasksClient(req.session.tokens);
    await tasks.tasks.delete({
      tasklist: req.params.listId,
      task: req.params.taskId,
    });
    res.status(204).end();
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error deleting task:', err.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.post('/api/tasklists/:listId/tasks/:taskId/move', requireAuth, async (req, res) => {
  const { previous } = req.body; // null = move to top
  try {
    const tasks = getTasksClient(req.session.tokens);
    const params = {
      tasklist: req.params.listId,
      task: req.params.taskId,
    };
    if (previous) params.previous = previous;
    const { data } = await tasks.tasks.move(params);
    res.json(data);
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error moving task:', err.message);
    res.status(500).json({ error: 'Failed to move task' });
  }
});

app.post('/api/tasklists/:listId/clear', requireAuth, async (req, res) => {
  try {
    const tasks = getTasksClient(req.session.tokens);
    await tasks.tasks.clear({ tasklist: req.params.listId });
    res.status(204).end();
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error clearing completed tasks:', err.message);
    res.status(500).json({ error: 'Failed to clear completed tasks' });
  }
});

// ─── API: User info ──────────────────────────────────────────────────────────

// ─── API: Task lists counts (incomplete) ─────────────────────────────────────────
app.get('/api/tasklists/counts', requireAuth, async (req, res) => {
  try {
    const tasks = getTasksClient(req.session.tokens);
    // Fetch all task lists
    const { data } = await tasks.tasklists.list({ maxResults: 100 });
    const lists = data.items || [];

    // Helper to count incomplete tasks for a list with pagination
    async function countIncomplete(tasklistId) {
      let count = 0;
      let pageToken = null;
      do {
        const params = { tasklist: tasklistId, showCompleted: false, showHidden: false, maxResults: 100 };
        if (pageToken) params.pageToken = pageToken;
        const resp = await tasks.tasks.list(params);
        const items = resp.data.items || [];
        count += items.length;
        pageToken = resp.data.nextPageToken;
      } while (pageToken);
      return count;
    }

    const counts = {};
    await Promise.all(lists.map(async (list) => {
      try {
        counts[list.id] = await countIncomplete(list.id);
      } catch (err) {
        // If a list is inaccessible, skip it with count 0
        console.error('Error counting tasks for list', list.id, err && err.message);
        counts[list.id] = 0;
      }
    }));

    res.json(counts);
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error fetching task list counts:', err && err.message);
    res.status(500).json({ error: 'Failed to fetch task list counts' });
  }
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json(req.session.user || {});
});


// ─── API: Export all lists and tasks ───────────────────────────────────────
app.get('/api/export', requireAuth, async (req, res) => {
  try {
    const tasks = getTasksClient(req.session.tokens);
    const listsResp = await tasks.tasklists.list({ maxResults: 100 });
    const lists = listsResp.data.items || [];
    const output = [];
    for (const list of lists) {
      const items = [];
      let pageToken = null;
      do {
        const params = { tasklist: list.id, showCompleted: true, showHidden: false, maxResults: 100 };
        if (pageToken) params.pageToken = pageToken;
        const resp = await tasks.tasks.list(params);
        const pageItems = resp.data.items || [];
        items.push(...pageItems);
        pageToken = resp.data.nextPageToken;
      } while (pageToken);
      output.push({ id: list.id, title: list.title, tasks: items });
    }
    res.json({ lists: output });
  } catch (err) {
    if (handleApiError(err, req, res)) return;
    console.error('Error exporting tasks:', err && err.message);
    res.status(500).json({ error: 'Failed to export tasks' });
  }
});

// ─── Start ───────────────────────────────────────────────────────────────────


// Status endpoint (helps readiness checks without auth)
app.get('/api/status', (req, res) => {
  try {
    const pkg = require('./package.json');
    const envChecks = {
      google_client_id: !!process.env.GOOGLE_CLIENT_ID,
      google_client_secret: !!process.env.GOOGLE_CLIENT_SECRET,
      session_secret: !!process.env.SESSION_SECRET,
    };
    res.json({
      name: pkg.name,
      version: pkg.version,
      node: process.version,
      baseUrl: BASE_URL,
      env: envChecks,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'status_unavailable' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


// Readiness endpoint (optional Google probe)
app.get('/api/readiness', async (req, res) => {
  // If the env var is not set the endpoint returns a lightweight OK.
  const doProbe = !!(process.env.READINESS_CHECK_GOOGLE && String(process.env.READINESS_CHECK_GOOGLE) !== '0' && String(process.env.READINESS_CHECK_GOOGLE).toLowerCase() !== 'false');
  if (!doProbe) {
    return res.json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // If an authenticated refresh token is provided we will try a minimal
  // authenticated probe (refresh + list tasklists) to verify OAuth flow.
  const authRefreshToken = process.env.READINESS_CHECK_GOOGLE_AUTH_REFRESH_TOKEN;

  // Helper: timeout wrapper
  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, rej) => setTimeout(() => rej(new Error('probe_timeout')), ms)),
    ]);
  }

  if (authRefreshToken) {
    try {
      const oauth2Client = createOAuthClient();
      // Attach only the refresh token so client can refresh an access token.
      oauth2Client.setCredentials({ refresh_token: authRefreshToken });

      // Try refreshing and calling the Tasks API within 3s.
      const probe = (async () => {
        // Refresh access token
        if (typeof oauth2Client.refreshAccessToken === 'function') {
          // older googleapis helper (returns {credentials})
          const refreshed = await oauth2Client.refreshAccessToken();
          oauth2Client.setCredentials(refreshed.credentials || refreshed);
        } else if (typeof oauth2Client.getAccessToken === 'function') {
          // newer googleapis may provide getAccessToken; call it to trigger refresh
          await oauth2Client.getAccessToken();
        }

        const tasks = google.tasks({ version: 'v1', auth: oauth2Client });
        const resp = await tasks.tasklists.list({ maxResults: 1 });
        return resp;
      })();

      const resp = await withTimeout(probe, 3000);
      if (resp && resp.data) {
        return res.json({ status: 'ok', google_api: { ok: true, authenticated: true }, timestamp: new Date().toISOString() });
      }
      return res.status(502).json({ status: 'fail', google_api: { ok: false, authenticated: true }, timestamp: new Date().toISOString() });
    } catch (err) {
      return res.status(502).json({ status: 'fail', google_api: { ok: false, authenticated: true, error: err && err.message }, timestamp: new Date().toISOString() });
    }
  }

  // Fallback: perform a lightweight unauthenticated probe of the discovery doc.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const url = 'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest';
    const resp = await withTimeout(fetch(url, { signal: controller.signal }), 2500);
    clearTimeout(timeout);
    if (resp && resp.ok) {
      return res.json({ status: 'ok', google_api: { ok: true, authenticated: false, status: resp.status }, timestamp: new Date().toISOString() });
    }
    return res.status(502).json({ status: 'fail', google_api: { ok: false, authenticated: false, status: resp && resp.status }, timestamp: new Date().toISOString() });
  } catch (err) {
    return res.status(502).json({ status: 'fail', error: 'google_api_unreachable', message: err && err.message, timestamp: new Date().toISOString() });
  }
});

app.listen(PORT, () => {
  console.log(`Tasklr running at ${BASE_URL}`);
});
