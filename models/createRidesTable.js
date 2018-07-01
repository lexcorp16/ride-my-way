import client from './db';

client.query(
  'CREATE TABLE IF NOT EXISTS ride_offers(id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), destination VARCHAR(50) not null, point_of_departure VARCHAR(50) not null, vehicle_capacity SMALLINT not null, departure_time TIME not null, departure_date DATE not null)',
  (err, res) => {
    console.log(err, res);
    client.end();
    process.exit();
  },
);
