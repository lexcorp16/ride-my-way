import client from './db';

const queryString = 'CREATE TABLE IF NOT EXISTS users(id UUID PRIMARY KEY, full_name VARCHAR(100) not null, phone_number VARCHAR(14) not null, email VARCHAR(40) not null unique, password VARCHAR(255) not null, created_at timestamp with time zone not null, updated_at timestamp with time zone not null)';

client.query(
  queryString,
  (err, res) => {
    console.log(err, res);
    client.end();
    process.exit();
  },
);
