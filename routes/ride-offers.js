import express from 'express';

import * as rideController from '../controllers/ride-offers';

const router = express.Router();

router.get('/api/v1/rides', rideController.getAllRides);

router.get('/api/v1/rides/:rideId', rideController.getOneRide);

router.get('/api/v1/rides/:rideId/requests', rideController.getOfferRequests);

router.post('/api/v1/rides', rideController.createRideOffer);

router.post('/api/v1/rides/:rideId/requests', rideController.joinRide);

router.post('/api/v1/rides/:rideId/requests/:requestId', rideController.respondToRideRequest);

export default router;
