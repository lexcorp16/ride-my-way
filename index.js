import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

import apiRoutes from './routes/ride-offers';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', apiRoutes);

app.get('/', (req, res) => {
  res.send('Ride My Way!');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
