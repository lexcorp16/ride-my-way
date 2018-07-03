import express from 'express';

import * as rideController from '../controllers/ride-offers';
import verifyLogin from '../middlewares/verifyLogin';

const router = express.Router();

router.post('/rides', verifyLogin, rideController.createRideOffer);

router.get('/rides/:rideId/requests', verifyLogin, rideController.getOfferRequests);

router.put('/rides/:rideId/requests/:requestId', verifyLogin, rideController.respondToRideRequest);

export default router;
