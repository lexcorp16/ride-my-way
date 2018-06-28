import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

import apiRoutes from './routes/ride-offers';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
