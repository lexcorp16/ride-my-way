import express from 'express';

import * as rideController from '../controllers/ride-offers';

const router = express.Router();

router.get('/v1/rides', rideController.getAllRides);

router.get('/v1/rides/:rideId', rideController.getOneRide);

router.get('/v1/rides/:rideId/requests', rideController.getOfferRequests);

router.post('/v1/rides', rideController.createRideOffer);

router.post('/v1/rides/:rideId/requests', rideController.joinRide);

router.post('/v1/rides/:rideId/requests/:requestId', rideController.respondToRideRequest);

export default router;
