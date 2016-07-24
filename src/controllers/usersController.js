import userBase from '../database/redis';
import postGres from '../database/postgres';

// checks if a device is already registered in the redis store
// expects a deviceId, will return userInfo which contains a boolean
// true = new user, false = existing user
const redisCheck = (req, res) => {
  userBase.get(req.query.deviceId, (err, value) => {
    if (value) {
      postGres.User.find({
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
        postGres.User.create({
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
  postGres.User.create({
    displayName: req.body.displayName,
    avatar: req.body.avatar,
  }).then(() => res.sendStatus(300));
};

// change user information
const changeUserInfo = (req, res) => {
  postGres.User.find({
    where: {
      id: req.body.id,
    },
  }).then(userData => {
    const changes = {
      displayName: req.body.displayName || null,
      avatar: req.body.avatar || null,
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

export default { redisCheck, postUser, changeUserInfo };
