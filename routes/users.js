import express from 'express';

import * as rideController from '../controllers/ride-offers';
import verifyLogin from '../middlewares/verifyLogin';
import validateDateTime from '../middlewares/validateDateTime';
import validateId from '../middlewares/validateId';

const router = express.Router();

router.post('/rides', verifyLogin, validateDateTime, rideController.createRideOffer);

router.get('/rides', verifyLogin, rideController.getUserRides);

router.get('/requests', verifyLogin, rideController.getUserRequests);

router.delete('/rides/:rideId', verifyLogin, validateId, rideController.deleteRideOffer);

router.get('/rides/:rideId/requests', verifyLogin, validateId, rideController.getOfferRequests);

router.put('/rides/:rideId/requests/:requestId', verifyLogin, rideController.respondToRideRequest);

export default router;
