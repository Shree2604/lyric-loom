// redisClient.js
const { createClient } = require('redis');

let client;

async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL, 
    });

    client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    try {
      await client.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', err);
      throw err;
    }
  }

  return client;
}

module.exports = getRedisClient;
