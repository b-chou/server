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

router.route('/getCurrentEvents')
  .get(hypeController.getCurrentEvents);

router.route('/getHypeTimeline')
  .get(hypeController.getTimeline);

router.route('/getSpecificEvent')
  .get(hypeController.getSpecificEvent);

export default router;
