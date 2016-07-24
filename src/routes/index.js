import express from 'express';
import usersController from '../controllers/usersController';

// Create Router
// eslint-disable-next-line
const router = express.Router();

// router.get('/api/users', usersController.getUsers);
router.route('/validation')
    .get(usersController.redisCheck)
    .post(usersController.postUser);

export default router;
