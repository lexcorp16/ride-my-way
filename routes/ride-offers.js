import express from 'express';

import * as rideController from '../controllers/ride-offers';

const router = express.Router();

router.get('/api/v1/rides', rideController.getAllRides);

router.get('/api/v1/rides/:rideId', rideController.getOneRide);

export default router;
