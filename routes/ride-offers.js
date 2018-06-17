import express from 'express';

import getAllRides from '../controllers/ride-offers';

const router = express.Router();

router.get('/api/v1/rides', getAllRides);

export default router;
