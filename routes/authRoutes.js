import express from 'express';

import * as authController from '../controllers/auth';
import validateUserData from '../middlewares/validateUser';

const router = express.Router();

router.post('/signup', validateUserData, authController.createUser);

router.post('/login', validateUserData, authController.logInUser);

export default router;
