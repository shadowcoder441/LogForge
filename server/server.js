const express = require('express');
const cors = require('cors');

const app = express();

// ✅ CORS middleware (fixes your issue)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

const PORT = process.env.PORT || 3000;

// In-memory storage (for demo)
let logs = [];

/**
 * Root route
 */
app.get('/', (req, res) => {
  res.send('LogForge API is running 🚀');
});

/**
 * Get recent logs
 */
app.get('/logs/recent', (req, res) => {
  res.json(logs);
});

/**
 * Add log
 */
app.post('/log', (req, res) => {
  const log = req.body;

  logs.unshift(log);        // add new log at start
  logs = logs.slice(0, 50); // keep only latest 50

  res.json({ status: 'log stored' });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});