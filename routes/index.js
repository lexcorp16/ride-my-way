import express from 'express';

import ridesRoutes from './ride-offers';
import authRoutes from './authRoutes';
import userRoutes from './users';

const v1 = express.Router();

v1.use('/v1/auth', authRoutes);
v1.use('/v1/rides', ridesRoutes);
v1.use('/v1/users', userRoutes);

export default v1;
