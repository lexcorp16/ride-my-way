import express from 'express';

import * as rideController from '../controllers/ride-offers';
import verifyLogin from '../middlewares/verifyLogin';

const router = express.Router();

router.get('/', rideController.getAllRides);

router.get('/:rideId', rideController.getOneRide);

router.get('/:rideId/requests', rideController.getOfferRequests);

router.post('/', rideController.createRideOffer);

router.post('/:rideId/requests', rideController.joinRide);

router.post('/:rideId/requests/:requestId', rideController.respondToRideRequest);
router.get('/v1/rides', verifyLogin, rideController.getAllRides);

router.post('/v1/users/rides', verifyLogin, rideController.createRideOffer);

router.get('/v1/users/rides/:rideId/requests', verifyLogin, rideController.getOfferRequests);

router.get('/v1/rides/:rideId', verifyLogin, rideController.getOneRide);

router.post('/v1/rides/:rideId/requests', verifyLogin, rideController.joinRide);

router.put('/v1/users/rides/:rideId/requests/:requestId', verifyLogin, rideController.respondToRideRequest);

export default router;
