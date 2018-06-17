import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Ride My Way!');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
