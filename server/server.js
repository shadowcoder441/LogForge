const express = require('express');
const app = express();

let logs = [];

app.use(express.json());

app.post('/log', (req, res) => {
  logs.unshift(req.body);
  logs = logs.slice(0, 50);
  res.json({ status: 'ok' });
});

app.get('/logs/recent', (req, res) => {
  res.json(logs);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});