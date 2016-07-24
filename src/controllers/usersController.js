import userBase from '../database/redis';
import postGres from '../database/postgres';

// checks if a device is already registered in the redis store
// expects a deviceId, will return userInfo which contains a boolean
// true = new user, false = existing user
const redisCheck = (req, res) => {
  userBase.get(req.query.deviceId, (err, value) => {
    if (value) {
      postGres.Users.find({
        where: {
          id: value,
        },
      }).then(userInfo => {
        res.status(200).send({
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
        res.status(400).send({
          userId: keys.length + 1,
          newUser: true,
        });
      });
    }
  });
};

// adds a new user into the database given a displayName and a numerical avatar value
const postUser = (req, res) => {
  postGres.Users.create({
    displayName: req.body.displayName,
    avatar: req.body.avatar,
  }).then(() => res.sendStatus(300));
};

export default { redisCheck, postUser };
