const { Kafka } = require('kafkajs');
const { Client } = require('@elastic/elasticsearch');
const Redis = require('ioredis');

// Kafka setup
const kafka = new Kafka({
  clientId: 'consumer',
  brokers: ['localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'log-group' });

// Elasticsearch (v8 compatible)
const es = new Client({
  node: 'http://localhost:9200',
});

// Redis
const redis = new Redis();

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'logs', fromBeginning: true });

  console.log('Consumer started...');

  await consumer.run({
    eachMessage: async ({ message }) => {
      const log = JSON.parse(message.value.toString());

      console.log('Received:', log);

      // 🔥 Always push to Redis (no matter what)
      try {
        await redis.lpush('logs', JSON.stringify(log));
        await redis.ltrim('logs', 0, 49);
        console.log('Stored in Redis');
      } catch (err) {
        console.error('Redis error:', err.message);
      }

      // 🔥 Try Elasticsearch (but don't crash if it fails)
      try {
        await es.index({
          index: 'logs',
          document: log,
        });
        console.log('Indexed in Elasticsearch');
      } catch (err) {
        console.error('Elasticsearch error:', err.message);
      }
    },
  });
};

run().catch(console.error);