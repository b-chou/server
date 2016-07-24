'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Connection Configurations
var PORT = process.env.REDIS_PORT || '6379';
var HOST = process.env.REDIS_HOST || 'localhost';

_bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);
_bluebird2.default.promisifyAll(_redis2.default.Multi.prototype);

var client = _redis2.default.createClient(PORT, HOST);

client.on('error', function (err) {
  console.log('Error:', err);
});

exports.default = client;

// You have to promisify in the same js file that you make your query
// get all values in the db --> client.keysAsync('*')
// delete all values from all db's --> client.flushdbAsync()