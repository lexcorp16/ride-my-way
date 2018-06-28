import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Pool({
  user:
    process.env.NODE_ENV === 'test'
      ? process.env.PGUSER_TEST
      : process.env.PGUSER,
  host:
    process.env.NODE_ENV === 'test'
      ? process.env.PGHOST_TEST
      : process.env.PGHOST,
  database:
    process.env.NODE_ENV === 'test'
      ? process.env.PGDATABASE_TEST
      : process.env.PGDATABASE,
  password:
    process.env.NODE_ENV === 'test'
      ? process.env.PGPASSWORD_TEST
      : process.env.PGPASSWORD,
  port:
    process.env.NODE_ENV === 'test'
      ? process.env.PGPORT_TEST
      : process.env.PGPORT,
});

client.connect();

export default client;
