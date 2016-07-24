const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const userBase = redis.createClient('6379', 'localhost');

userBase.on('error', (err) => {
  console.log('Error:', err);
});
module.exports = userBase;

// You have to promisify in the same js file that you make your query
// get all values in the db --> client.keysAsync('*')
// delete all values from all db's --> client.flushdbAsync()
