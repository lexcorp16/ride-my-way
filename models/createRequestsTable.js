import client from './db';

client.query(
  "CREATE TABLE IF NOT EXISTS requests(id UUID PRIMARY KEY, ride_id UUID REFERENCES ride_offers(id), user_id UUID not null, name VARCHAR(100) not null, status request_status DEFAULT 'pending')",
  (err, res) => {
    console.log(err, res);
    client.end();
    process.exit();
  },
);
