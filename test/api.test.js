/* eslint no-unused-expressions: 0 */

import chai from 'chai';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import app from '../index';
import client from '../models/db';
import setupDatabase from './dbsetup';

const { expect } = chai;

dotenv.config();

describe('API tests', () => {
  before(() => setupDatabase());

  after(() => client.query('DROP TABLE users, ride_offers, requests'));

  const token = jwt.sign({
    id: '73a38220-7d3e-11e8-a4a2-c79efef2daf8',
  }, process.env.JWTSECRET, {
    expiresIn: 86400,
  });

  const user2token = jwt.sign({
    id: '33a38220-7d3e-11e8-a4a2-c79efef2daf8',
  }, process.env.JWTSECRET, {
    expiresIn: 86400,
  });

  it('Creates a new ride offer', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        vehicleCapacity: 5,
        destination: 'toronto',
        departureTime: '10:50',
        pointOfDeparture: 'ontario',
        departureDate: '02/05/2018',
      })
      .set('x-access-token', token)
      .expect(201)
      .end((err, res) => {
        expect(res.body.data.destination).to.equal('toronto');
        expect(res.body.data.point_of_departure).to.equal('ontario');
        done();
      });
  });

  it('Returns a 401 if token is missing', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        vehicleCapacity: 5,
        destination: 'Toronto',
        departureTime: '10:30 PM',
        pointOfDeparture: 'Ontario',
        departureDate: '02/02/2018',
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal('You need to login to access this route.');
        done();
      });
  });

  it('Returns a 400 if a user tries to create multiple offers for the same period', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        vehicleCapacity: 5,
        destination: 'Toronto',
        departureTime: '10:30',
        pointOfDeparture: 'Ontario',
        departureDate: '02/08/2018',
      })
      .set('x-access-token', token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('You already have a ride scheduled for this period.');
        done();
      });
  });

  it('Returns a 401 if token is missing', (done) => {
    request(app)
      .post('/api/v1/users/rides')
      .send({
        vehicleCapacity: 5,
        destination: 'Toronto',
        departureTime: '10:30 PM',
        pointOfDeparture: 'Ontario',
        departureDate: '02/02/2018',
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body.message).to.equal('You need to login to access this route.');
        done();
      });
  });

  it('Returns a 401 if token is invalid', (done) => {
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
      .expect(401)
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
        expect(res.body.message).to.equal('One of the following fields is missing; destination, vehicleCapacity, departureTime, pointOfDeparture, departureDate.');
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

  it('Returns a 404 if no ride is found when trying to get a ride offer', (done) => {
    request(app)
      .get('/api/v1/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf9')
      .set('x-access-token', token)
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.equal('Ride offer with that id does not exist.');
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

  it('Can join a ride offer', (done) => {
    request(app)
      .post('/api/v1/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests')
      .set('x-access-token', user2token)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.name).to.equal('Medoye Bimbo');
        done();
      });
  });

  it('Returns a 400 if a user tries to join a ride offer more than once', (done) => {
    request(app)
      .post('/api/v1/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests')
      .set('x-access-token', user2token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('You have already made a request for this ride offer.');
        done();
      });
  });

  it('Returns a 400 if vehicle capacity is 0 when trying to join ride offer', (done) => {
    request(app)
      .post('/api/v1/rides/53a38220-7d3e-11e8-a4a2-c79efef2daf8/requests')
      .set('x-access-token', user2token)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.equal('All seats for this ride offer have been booked.');
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

  it('Returns a 403 if the wrong user tries to view requests for a ride offer', (done) => {
    const unknownUsertoken = jwt.sign({
      id: '93a38220-7d3e-11e8-a4a2-c79efef2daf8',
    }, process.env.JWTSECRET, {
      expiresIn: 86400,
    });

    request(app)
      .get('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests')
      .set('x-access-token', unknownUsertoken)
      .expect(403)
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

  it('Returns a 403 if the wrong user tries to respond to a ride request', (done) => {
    const unknownUsertoken = jwt.sign({
      id: '93a38220-7d3e-11e8-a4a2-c79efef2daf8',
    }, process.env.JWTSECRET, {
      expiresIn: 86400,
    });

    request(app)
      .put('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8/requests/83a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', unknownUsertoken)
      .send({ status: 'accepted' })
      .expect(403)
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

  it('Returns a 403 if the wrong user tries to delete a ride offer', (done) => {
    const unknownUsertoken = jwt.sign({
      id: '93a38220-7d3e-11e8-a4a2-c79efef2daf8',
    }, process.env.JWTSECRET, {
      expiresIn: 86400,
    });

    request(app)
      .delete('/api/v1/users/rides/73a38220-7d3e-11e8-a4a2-c79efef2daf8')
      .set('x-access-token', unknownUsertoken)
      .expect(403)
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

  it('Returns a 200 when trying to access api docs', (done) => {
    request(app)
      .get('/api/docs')
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
  });
});
