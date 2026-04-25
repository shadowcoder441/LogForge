const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'producer',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

const run = async () => {
  await producer.connect();

  setInterval(async () => {
    const log = {
      service: 'payment-service',
      level: 'INFO',
      message: 'Transaction processed',
      timestamp: new Date().toISOString(),
    };

    await producer.send({
      topic: 'logs',
      messages: [{ value: JSON.stringify(log) }],
    });

    console.log('Sent:', log);
  }, 2000);
};

run().catch(console.error);