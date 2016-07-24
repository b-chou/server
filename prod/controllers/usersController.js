'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redis = require('../database/redis');

var _redis2 = _interopRequireDefault(_redis);

var _postgres = require('../database/postgres');

var _postgres2 = _interopRequireDefault(_postgres);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// checks if a device is already registered in the redis store
// expects a deviceId, will return userInfo which contains a boolean
// true = new user, false = existing user
var redisCheck = function redisCheck(req, res) {
  _redis2.default.get(req.query.deviceId, function (err, value) {
    if (value) {
      _postgres2.default.User.find({
        where: {
          id: value
        }
      }).then(function (userInfo) {
        res.status(200).send({
          userInfo: {
            newUser: false,
            info: userInfo
          }
        });
      });
    } else {
      _redis2.default.keys('*', function (e, keys) {
        _redis2.default.set(req.query.deviceId, keys.length + 1);
        _postgres2.default.User.create({
          displayName: 'bob',
          avatar: 1
        });
        // user does not exist, it will return to native app newUser = true
        // user will have to type in display name then update
        res.status(400).send({
          userId: keys.length + 1,
          newUser: true
        });
      });
    }
  });
};

// adds a new user into the database given a displayName and a numerical avatar value
var postUser = function postUser(req, res) {
  _postgres2.default.User.create({
    displayName: req.body.displayName,
    avatar: req.body.avatar
  }).then(function () {
    return res.sendStatus(300);
  });
};

// change user information
var changeUserInfo = function changeUserInfo(req, res) {
  _postgres2.default.User.find({
    where: {
      id: req.body.id
    }
  }).then(function (userData) {
    var changes = {
      displayName: req.body.displayName || null,
      avatar: req.body.avatar || null
    };
    if (!changes.displayName) {
      delete changes.displayName;
    }
    if (!changes.avatar) {
      delete changes.avatar;
    }
    userData.updateAttributes(changes);
    res.status(200).send({ changedAttributes: changes });
  });
};

exports.default = { redisCheck: redisCheck, postUser: postUser, changeUserInfo: changeUserInfo };