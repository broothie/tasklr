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

