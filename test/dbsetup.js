import client from '../models/db';

const setupDatabase = () =>
  client.query('CREATE TABLE IF NOT EXISTS users(id UUID PRIMARY KEY, full_name VARCHAR(100) not null, phone_number VARCHAR(14) not null, email VARCHAR(40) not null unique, password VARCHAR(255) not null)').then(() => {
    return client.query('CREATE TABLE ride_offers(id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), destination VARCHAR(50) not null, point_of_departure VARCHAR(50) not null, vehicle_capacity SMALLINT not null, departure_time TIME not null, departure_date DATE not null)').then(() => {
      return client.query("CREATE TABLE requests(id UUID PRIMARY KEY, ride_id UUID REFERENCES ride_offers(id) ON DELETE CASCADE, user_id UUID not null, name VARCHAR(100) not null, status request_status DEFAULT 'pending')").then(() => {
        return client
          .query('INSERT INTO users(id, full_name, phone_number, email, password) values($1, $2, $3, $4, $5),($6, $7, $8, $9, $10) RETURNING *', [
            '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
            'Fashola Eniola',
            '08124774308',
            'email@email.com',
            'llswhfwoiholnsklhflqaoih',
            '33a38220-7d3e-11e8-a4a2-c79efef2daf8',
            'Medoye Bimbo',
            '08124774309',
            'email2@email.com',
            'llswhfwoiholnsklhflqaoih',
          ]).then(() => {
            client
              .query(
                'INSERT INTO ride_offers(id, user_id, destination, point_of_departure, vehicle_capacity, departure_time, departure_date) values($1, $2, $3, $4, $5, $6, $7),($8, $9, $10, $11, $12, $13, $14) RETURNING *',
                [
                  '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
                  '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
                  'Mowe',
                  'Ibafo',
                  5,
                  '10:30',
                  '02/08/2080',
                  '53a38220-7d3e-11e8-a4a2-c79efef2daf8',
                  '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
                  'Mowe',
                  'Ibafo',
                  0,
                  '10:30 PM',
                  '02/08/2018',
                ],
              ).then(() => {
                client
                  .query(
                    'INSERT INTO requests(id, ride_id, user_id, name) values($1, $2, $3, $4) RETURNING *',
                    [
                      '83a38220-7d3e-11e8-a4a2-c79efef2daf8',
                      '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
                      '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
                      'Fashola Eniola',
                    ],
                  );
              });
          });
      });
    });
  });

export default setupDatabase;
