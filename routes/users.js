import express from 'express';

import * as rideController from '../controllers/ride-offers';
import verifyLogin from '../middlewares/verifyLogin';
import validateDateTime from '../middlewares/validateDateTime';

const router = express.Router();

router.post('/rides', verifyLogin, validateDateTime, rideController.createRideOffer);

router.delete('/rides/:rideId', verifyLogin, rideController.deleteRideOffer);

router.get('/rides/:rideId/requests', verifyLogin, rideController.getOfferRequests);

router.put('/rides/:rideId/requests/:requestId', verifyLogin, rideController.respondToRideRequest);

export default router;
