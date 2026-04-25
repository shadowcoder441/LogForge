app.get('/', (req, res) => {
  res.send('LogForge API is running 🚀');
});

const express = require('express');
const Redis = require('ioredis');

const app = express();

let logs = [];

let redis;
try {
  redis = new Redis(process.env.REDIS_URL);
  redis.on('connect', () => console.log('Redis connected'));
  redis.on('error', () => console.log('Redis not available, using memory'));
} catch {
  console.log('Redis not available, using memory');
}

app.get('/', (req, res) => {
  res.send('LogForge API is running 🚀');
});

app.get('/logs/recent', async (req, res) => {
  try {
    if (redis) {
      const data = await redis.lrange('logs', 0, 49);
      return res.json(data.map(JSON.parse));
    } else {
      return res.json(logs);
    }
  } catch {
    return res.json(logs);
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});