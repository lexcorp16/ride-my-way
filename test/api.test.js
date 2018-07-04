/* eslint no-unused-expressions: 0 */

import chai from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import app from '../index';
import client from '../models/db';

const { expect } = chai;

dotenv.config();

const setupDatabase = () =>
  client.query('CREATE TABLE IF NOT EXISTS users(id UUID PRIMARY KEY, full_name VARCHAR(100) not null, phone_number VARCHAR(14) not null, email VARCHAR(40) not null unique, password VARCHAR(255) not null)').then(() => {
    return client.query('CREATE TABLE ride_offers(id UUID PRIMARY KEY, user_id UUID REFERENCES users(id), destination VARCHAR(50) not null, point_of_departure VARCHAR(50) not null, vehicle_capacity SMALLINT not null, departure_time TIME not null, departure_date DATE not null)').then(() => {
      return client.query("CREATE TABLE requests(id UUID PRIMARY KEY, ride_id UUID REFERENCES ride_offers(id) ON DELETE CASCADE, user_id UUID not null, name VARCHAR(100) not null, status request_status DEFAULT 'pending')").then(() => {
        return client
          .query('INSERT INTO users(id, full_name, phone_number, email, password) values($1, $2, $3, $4, $5) RETURNING *', [
            '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
            'Fashola Eniola',
            '08124774308',
            'email@email.com',
            'llswhfwoiholnsklhflqaoih',
          ]).then(() => {
            client
              .query(
                'INSERT INTO ride_offers(id, user_id, destination, point_of_departure, vehicle_capacity, departure_time, departure_date) values($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [
                  '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
                  '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
                  'Mowe',
                  'Ibafo',
                  5,
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

describe('API tests', () => {
  before(() => setupDatabase());

  after(() => client.query('DROP TABLE users, ride_offers, requests'));

  const token = jwt.sign({
    id: '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
  }, process.env.JWTSECRET, {
    expiresIn: 86400,
  });

  it('Creates a new ride offer', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        vehicleCapacity: 5,
        destination: 'Toronto',
        departureTime: '10:30',
        pointOfDeparture: 'Ontario',
        departureDate: '02/02/2018',
      })
      .set('x-access-token', token)
      .expect(201)
      .end((err, res) => {
        expect(res.body.data.destination).to.equal('Toronto');
        expect(res.body.data.point_of_departure).to.equal('Ontario');
        done();
      });
  });

  it('Returns a 403 if token is missing', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        vehicleCapacity: 5,
        destination: 'Toronto',
        departureTime: '10:30 PM',
        pointOfDeparture: 'Ontario',
        departureDate: '02/02/2018',
      })
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('You need to login to access this route.');
        done();
      });
  });

  it('Returns a 403 if token is invalid', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        vehicleCapacity: 5,
        destination: 'Toronto',
        departureTime: '10:30 PM',
        pointOfDeparture: 'Ontario',
        departureDate: '02/02/2018',
      })
      .set('x-access-token', 'crappy token')
      .expect(403)
      .end((err, res) => {
        expect(res.body.message).to.equal('Failed to authenticate token. Please try to login again.');
        done();
      });
  });

  it('Returns a 400 if a feild is missing when creating a ride offer', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        destination: 'Toronto',
        departureTime: '10:30',
        pointOfDeparture: 'Ontario',
        departureDate: '02/02/2018',
      })
      .set('x-access-token', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('One of the following fields is missing "destination", "vehicleCapacity", "departureTime", "pointOfDeparture", "departureDate".');
        done();
      });
  });

  it('Returns a 400 if time is invalid when creating a ride offer', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        destination: 'Toronto',
        departureTime: 'bad time',
        pointOfDeparture: 'Ontario',
        departureDate: '02/02/2018',
      })
      .set('x-access-token', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('Please enter a time in this format hh:mm');
        done();
      });
  });

  it('Returns a 400 if date is invalid when creating a ride offer', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        destination: 'Toronto',
        departureTime: '10:30',
        pointOfDeparture: 'Ontario',
        departureDate: 'bad date',
      })
      .set('x-access-token', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('Please enter a date in this format dd/mm/yyyy');
        done();
      });
  });

  it('Gets all ride offers', (done) => {
    request(app)
      .get('/api/v1/rides')
      .set('x-access-token', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data).to.be.instanceOf(Array);
        done();
      });
  });

  it('Gets a single ride offer', (done) => {
    request(app)
      .get('/api/v1/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.destination).to.equal('Mowe');
        expect(res.body.data.vehicle_capacity).to.equal(5);
        done();
      });
  });

  it('Returns a 400 if id is invalid when trying to get a ride offer', (done) => {
    request(app)
      .get('/api/v1/rides/alexander')
      .set('x-access-token', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('ID supplied is invalid');
        done();
      });
  });

  it('Returns a 400 if a user tries to join a ride offer he has created', (done) => {
    request(app)
      .post('/api/v1/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests')
      .set('x-access-token', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('You cannot join a ride offer you have created.');
        done();
      });
  });

  it('Returns a 400 if id is invalid when trying to join a ride offer', (done) => {
    request(app)
      .post('/api/v1/rides/26626266/requests')
      .set('x-access-token', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('ID supplied is invalid');
        done();
      });
  });

  it('Gets all requests to join a ride offer', (done) => {
    request(app)
      .get('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests')
      .set('x-access-token', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data).to.be.instanceOf(Array);
        done();
      });
  });

  it('Returns a 400 if the wrong user tries to view requests for a ride offer', (done) => {
    const unknownUsertoken = jwt.sign({
      id: '93a38220-7d3e-11e8-a4a2-c79efef2daf8',
    }, process.env.JWTSECRET, {
      expiresIn: 86400,
    });

    request(app)
      .get('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests')
      .set('x-access-token', unknownUsertoken)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('You cannot view requests for ride offers created by others.');
        done();
      });
  });

  it('Can respond to a ride offer request', (done) => {
    request(app)
      .put('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests/83a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', token)
      .send({ status: 'accepted' })
      .expect(201)
      .end((err, res) => {
        expect(res.body.data.status).to.equal('accepted');
        done();
      });
  });

  it('Returns a 400 when trying to respond to a ride offer request with invalid data', (done) => {
    request(app)
      .put('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests/83a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', token)
      .send({ status: 'crapp' })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('status field supplied is invalid. Please supply "acepted" or "rejected"');
        done();
      });
  });

  it('Returns a 400 when status field is missing when trying to respond to a ride offer request', (done) => {
    request(app)
      .put('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests/83a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('status field is missing. Please supply "acepted" or "rejected"');
        done();
      });
  });

  it('Returns a 400 if the wrong user tries to respond to a ride request', (done) => {

    const unknownUsertoken = jwt.sign({
      id: '93a38220-7d3e-11e8-a4a2-c79efef2daf8',
    }, process.env.JWTSECRET, {
      expiresIn: 86400,
    });

    request(app)
      .put('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests/83a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', unknownUsertoken)
      .send({ status: 'accepted' })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('You are not permitted to respond to this request.');
        done();
      });
  });

  it('Returns a 404 if ride request does not exist when trying to respond to request', (done) => {
    request(app)
      .put('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests/93a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', token)
      .send({ status: 'accepted' })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('The specified request does not exist.');
        done();
      });
  });

  it('Returns a 400 if id is invalid when trying to respond to a ride offer', (done) => {
    request(app)
      .put('/api/v1/users/rides/2332442/requests/2553636773')
      .set('x-access-token', token)
      .send({ status: 'accepted' })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('ID supplied is invalid');
        done();
      });
  });

  it('Returns a 400 if ride offer does not exist when trying to delete a ride offer', (done) => {
    request(app)
      .delete('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf9')
      .set('x-access-token', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('A ride with that ID does not exist.');
        done();
      });
  });

  it('Returns a 400 if the wrong user tries to delete a ride offer', (done) => {
    const unknownUsertoken = jwt.sign({
      id: '93a38220-7d3e-11e8-a4a2-c79efef2daf8',
    }, process.env.JWTSECRET, {
      expiresIn: 86400,
    });

    request(app)
      .delete('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', unknownUsertoken)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('You are not permitted to delete this ride offer.');
        done();
      });
  });

  it('Deletes a  ride offer', (done) => {
    request(app)
      .delete('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.message).to.equal('1 Ride Offer(s) deleted successfully.');
        done();
      });
  });
});
