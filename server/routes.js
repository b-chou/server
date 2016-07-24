'use strict';

var controller = require('./controller.js');

module.exports = function (app) {
  app.route('/validation')
  	.get(controller.redisCheck);
};
