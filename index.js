import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import path from 'path';
import cors from 'cors';

import routes from './routes';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', routes);

app.get('/api/docs', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'docs/index.html'));
});

app.use('/doc-assets', express.static(path.resolve(__dirname, 'docs')));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

export default app;
