const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const CLICKUP_TOKEN = process.env.CLICKUP_TOKEN;
const LIST_ID = '901613834407';
const REPORTER_FIELD_ID = '750ab6c7-9365-4858-bfee-bf51c69cdbc7';

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/leaderboard', async (req, res) => {
  try {
    const counts = {};
    let page = 0;
    let hasMore = true;

    while (hasMore) {
      const url = `https://api.clickup.com/api/v2/list/${LIST_ID}/task?include_closed=true&page=${page}&subtasks=true`;
      const response = await fetch(url, {
        headers: { Authorization: CLICKUP_TOKEN }
      });

      if (!response.ok) {
        throw new Error(`ClickUp API error: ${response.status}`);
      }

      const data = await response.json();
      const tasks = data.tasks || [];

      for (const task of tasks) {
        const customFields = task.custom_fields || [];
        const reporterField = customFields.find(f => f.id === REPORTER_FIELD_ID);

        if (!reporterField || !reporterField.value || !Array.isArray(reporterField.value) || reporterField.value.length === 0) {
          continue;
        }

        for (const user of reporterField.value) {
          const name = user.username || user.email || 'Unknown';
          counts[name] = (counts[name] || 0) + 1;
        }
      }

      if (tasks.length === 0 || data.last_page) {
        hasMore = false;
      } else {
        page++;
      }
    }

    const reporters = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    const totalSubmissions = reporters.reduce((sum, r) => sum + r.count, 0);

    res.json({
      updatedAt: new Date().toISOString(),
      totalSubmissions,
      reporters
    });
  } catch (err) {
    console.error('Leaderboard fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

app.listen(PORT, () => {
  console.log(`Leaderboard server running on port ${PORT}`);
});
