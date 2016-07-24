const controller = require('./controller.js');

module.exports = app => {
  app.route('/validation')
    .get(controller.redisCheck)
    .post(controller.postUser);
};
