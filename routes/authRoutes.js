import express from 'express';

import * as authController from '../controllers/auth';
import * as validators from '../middlewares/validateUserData';

const router = express.Router();

router.post('/signup', validators.validateSignUpData, authController.createUser);

router.post('/login', validators.validateLoginData, authController.logInUser);

export default router;
