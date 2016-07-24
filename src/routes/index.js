import express from 'express';
import sequelize from 'sequelize';

import usersController from './controllers/users';
import userBase from './database/redis';
import postGres from './database/postgres';

// Create Router
const router = express.Router();

router.get('/api/users', usersController.getUsers);

export default router;