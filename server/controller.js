const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis.RedisClient.prototype);
const userBase = redis.createClient();
// var config = require('../api_keys.js');

module.exports = {

  redisCheck: (req, res) => {
    userBase.get(req.query.deviceId, (err, value) => {
      if (value) {
        res.send({ userId: value });
      } else {
        userBase.keys('*', (e, keys) => {
          console.log(keys.length);
        });
        res.send(false);
      }
    });

// client.set("akj;alsdf", "value");

// // This will return a JavaScript String
// client.get("akj;alsd", function (err, reply) {
//  if (reply) {
//    console.log(reply.toString());
//  } else {
//    console.log("not found");
//  }
// });

// client.keys('*', function (err, keys) {
//   console.log(keys.length);
// });
  },
};
