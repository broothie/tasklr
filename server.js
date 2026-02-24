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
function requireAuth(req, res, next) {
  if (!req.session.tokens) {
    return res.redirect('/login');
  }
  next();
}

// Helper: get authenticated Tasks client
function getTasksClient(tokens) {
  const oauth2Client = createOAuthClient();
  oauth2Client.setCredentials(tokens);
  return google.tasks({ version: 'v1', auth: oauth2Client });
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
    console.error('Error fetching task lists:', err);
    res.status(500).json({ error: 'Failed to fetch task lists' });
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
    console.error('Error fetching tasks:', err);
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
    console.error('Error creating task:', err);
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
    console.error('Error updating task:', err);
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
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// ─── API: User info ──────────────────────────────────────────────────────────

app.get('/api/me', requireAuth, (req, res) => {
  res.json(req.session.user || {});
});

// ─── Start ───────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Tasklr running at ${BASE_URL}`);
});
