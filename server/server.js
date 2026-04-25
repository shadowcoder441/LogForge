const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (for future POST requests)
app.use(express.json());

// In-memory storage (fallback for cloud deployment)
let logs = [];

/**
 * Root route
 * Used to verify that the API is running
 */
app.get('/', (req, res) => {
  res.send('LogForge API is running 🚀');
});

/**
 * Get recent logs
 * Returns last 50 logs
 */
app.get('/logs/recent', (req, res) => {
  res.json(logs);
});

/**
 * Optional: Add log manually (useful for testing via Postman/frontend)
 */
app.post('/log', (req, res) => {
  const log = req.body;

  logs.unshift(log);       // add to beginning
  logs = logs.slice(0, 50); // keep only latest 50

  res.json({ status: 'log stored' });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});