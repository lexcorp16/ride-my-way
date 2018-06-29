import client from './db';

client.query(
  'CREATE TABLE IF NOT EXISTS users(id UUID PRIMARY KEY, email VARCHAR(40) not null unique, password VARCHAR(255) not null)',
  (err, res) => {
    console.log(err, res);
    client.end();
  },
);
