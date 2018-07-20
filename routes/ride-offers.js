import express from 'express';

import * as rideController from '../controllers/ride-offers';
import verifyLogin from '../middlewares/verifyLogin';
import validateId from '../middlewares/validateId';

const router = express.Router();

router.get('/', verifyLogin, rideController.getAllRides);

router.get('/:rideId', verifyLogin, validateId, rideController.getOneRide);

router.post('/:rideId/requests', verifyLogin, validateId, rideController.joinRide);

export default router;
