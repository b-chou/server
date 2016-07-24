'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var port = process.env.SERVER_PORT || 8000;

app
// parse application/x-www-form-urlencoded
.use(_bodyParser2.default.urlencoded({ limit: '50mb', extended: true }))
// parse application/json
.use(_bodyParser2.default.json({ limit: '50mb' })).use(_routes2.default);

// starting server
app.listen(port, function (err) {
  if (err) console.log(err);
  console.log('Server is functional, on port: ' + port);
});

exports.default = app;