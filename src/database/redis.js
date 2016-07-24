import redis from 'redis';
import Promise from 'bluebird';

// Connection Configurations
const PORT = process.env.REDIS_PORT || 'localhost';
const HOST = process.env.REDIS_HOST || '6379';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(PORT, HOST);

client.on('error', (err) => {
  console.log('Error:', err);
});

export default client;

// You have to promisify in the same js file that you make your query
// get all values in the db --> client.keysAsync('*')
// delete all values from all db's --> client.flushdbAsync()