import express from 'express';
import usersController from '../controllers/usersController';
import hypeController from '../controllers/hypeController';

// Create Router
// eslint-disable-next-line
const router = express.Router();

// router.get('/api/users', usersController.getUsers);
router.route('/validation')
  .get(usersController.redisCheck)
  .post(usersController.postUser)
  .put(usersController.changeUserInfo);

router.route('/hypeCount')
  .get(hypeController.getHypeCount)
  .post(hypeController.increaseHypeCount)
  .delete(hypeController.deleteHypeEvent);

router.route('/getAllEvents')
  .get(hypeController.getAllEvents);

export default router;
