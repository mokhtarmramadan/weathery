import { createClient } from 'redis';
// Basic redis client class and exports a factory function that returns
// an instence of the class

class RedisClient {
  // RedisClient class


  static isReady = false;

  async connect() {
    // Establishes a redis client connection
    this.client = createClient();
    this.client.on('error', err => console.log('Redis Client Error:', err));
    await this.client.connect();
    RedisClient.isReady = this.client.isReady;
  }

  isAlive() {
    // Returns the status of redis connection:
    // true: connected
    // false: disconnected
    return RedisClient.isReady;
  }

  async get(key) {
    // Gets the value of a certain key
    if(!key) {
      return console.error('Usage: get(key)');
    }
    return this.client.get(key);
  }

  async set(key, value, EX=18000) {
    // Sets a key with an expiry time which is 18000 seconds by default
    if (!key || ! value) {
      return console.error('Usage: set(key, value)');
    }
    return this.client.set(key, value, { EX });
  }

  async del(key) {
    // Deletes a key
    if (!key) {
      return console.error('Usage: del(key)');
    }
    return this.client.del(key);
  }
}


async function redisConnector () {
  const client = new RedisClient();
  await client.connect();
  return client;
}

export { redisConnector };
