import express from 'express';

import ridesRoutes from './ride-offers';
import authRoutes from './authRoutes';

const v1 = express.Router();

v1.use('/v1/auth', authRoutes);
v1.use('/v1/rides', ridesRoutes);

export default v1;
