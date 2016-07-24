const userBase = require('./redisConnection.js');
const postGres = require('./pgConnection.js');
// var config = require('../api_keys.js');

module.exports = {

  redisCheck: (req, res) => {
    userBase.get(req.query.deviceId, (err, value) => {
      if (value) {
        postGres.find({
          where: {
            id: value,
          },
        }).then(userInfo => {
          res.send({
            userInfo: {
              newUser: false,
              info: userInfo,
            },
          });
        });
      } else {
        userBase.keys('*', (e, keys) => {
          userBase.set(req.query.deviceId, keys.length + 1);
          postGres.create({
            displayName: 'bob',
          });
          // user does not exist, it will return to native app newUser = true
          // user will have to type in display name then update
          res.send({
            userId: keys.length + 1,
            newUser: true,
          });
        });
      }
    });
  },

  postUser: (req, res) => {
    postGres.create({
      displayName: req.body.displayName,
    }).then(() => res.sendStatus(200));
  },
};
