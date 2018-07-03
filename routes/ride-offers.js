import express from 'express';

import * as rideController from '../controllers/ride-offers';

const router = express.Router();

router.get('/', rideController.getAllRides);

router.get('/:rideId', rideController.getOneRide);

router.get('/:rideId/requests', rideController.getOfferRequests);

router.post('/', rideController.createRideOffer);

router.post('/:rideId/requests', rideController.joinRide);

router.post('/:rideId/requests/:requestId', rideController.respondToRideRequest);

export default router;
