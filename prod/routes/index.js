'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _usersController = require('../controllers/usersController');

var _usersController2 = _interopRequireDefault(_usersController);

var _hypeController = require('../controllers/hypeController');

var _hypeController2 = _interopRequireDefault(_hypeController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create Router
// eslint-disable-next-line
var router = _express2.default.Router();

// router.get('/api/users', usersController.getUsers);
router.route('/validation').get(_usersController2.default.redisCheck).post(_usersController2.default.postUser).put(_usersController2.default.changeUserInfo);

router.route('/hypeCount').get(_hypeController2.default.getHypeCount).post(_hypeController2.default.increaseHypeCount).delete(_hypeController2.default.deleteHypeEvent);

router.route('/getAllEvents').get(_hypeController2.default.getAllEvents);

router.route('/getHypeTimeline').get(_hypeController2.default.getTimeline);

exports.default = router;