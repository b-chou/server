const redisCheck = (req, res) => {
  userBase.get(req.query.deviceId, (err, value) => {
    if (value) {
      postGres.users.find({
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
        postGres.users.create({
          displayName: 'bob',
          avatar: 2,
        });
        res.send({
          userId: keys.length + 1,
          newUser: true,
        });
      });
    }
  });
},

export default { redisCheck };