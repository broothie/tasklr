require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { google } = require('googleapis');
const path = require('path');

const app = express();
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
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-prod',
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
      const { credentials } = await oauth2Client.refreshAccessToken();
      session.tokens = credentials;
      return credentials;
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
  if (err.status === 401) {
    // Token is revoked or invalid
    req.session.destroy(() => {
      res.status(401).json({ error: 'Authentication failed. Please sign in again.' });
    });
    return true;
  }
  if (err.status === 403) {
    console.error('Permission denied:', err);
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

app.listen(PORT, () => {
  console.log(`Tasklr running at ${BASE_URL}`);
});
