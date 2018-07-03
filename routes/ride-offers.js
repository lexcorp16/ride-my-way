import express from 'express';

import * as rideController from '../controllers/ride-offers';
import verifyLogin from '../middlewares/verifyLogin';

const router = express.Router();

router.get('/', verifyLogin, rideController.getAllRides);

router.get('/:rideId', verifyLogin, rideController.getOneRide);

router.post('/:rideId/requests', verifyLogin, rideController.joinRide);

export default router;
