import userBase from '../database/redis';
import postGres from '../database/postgres';

const redisCheck = (req, res) => {
  userBase.get(req.query.deviceId, (err, value) => {
    if (value) {
      postGres.Users.find({
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
        postGres.Users.create({
          displayName: 'bob',
          avatar: 1,
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
};

const postUser = (req, res) => {
  postGres.Users.create({
    displayName: req.body.displayName,
    avatar: req.body.avatar,
  }).then(() => res.sendStatus(200));
};

export default { redisCheck, postUser };
