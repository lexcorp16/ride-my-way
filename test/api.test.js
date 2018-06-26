/* eslint no-unused-expressions: 0 */

import chai from 'chai';
import request from 'supertest';

import app from '../index';

const { expect } = chai;

describe('API tests', () => {
  it('Gets all ride offers', (done) => {
    request(app)
      .get('/api/v1/rides')
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.response).to.not.be.undefined;
        done();
      });
  });

  it('Gets a single ride offer', (done) => {
    request(app)
      .get('/api/v1/rides/1')
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.data).to.be.instanceof(Object);
        expect(res.body.data.id).to.equal(1);
        done();
      });
  });

  it('Returns a 404 if a ride offer does not exist when trying to get a single ride offer', (done) => {
    request(app)
      .get('/api/v1/rides/0')
      .expect(404)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.error).to.contain('Out of bounds');
        done();
      });
  });

  it('Creates a new ride offer', (done) => {
    const newRide = {
      driver: 'Casper Gambini',
      destination: 'Toronto',
      departureTime: '10:30 PM',
      pointOfDeparture: 'Ontario',
    };

    request(app)
      .post('/api/v1/rides')
      .send(newRide)
      .expect(201)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.driver).to.equal('Casper Gambini');
        done();
      });
  });

  it('Returns a 400 if a required field is absent when creating a new ride offer', (done) => {
    const newRide = {
      driver: 'Casper Gambini',
      departureTime: '10:30 PM',
      pointOfDeparture: 'Ontario',
    };

    request(app)
      .post('/api/v1/rides')
      .send(newRide)
      .expect(400)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.contain('Required field missing');
        done();
      });
  });

  it('Makes a request to join a ride offer', (done) => {
    const name = 'Zoyal';

    request(app)
      .post('/api/v1/rides/2/requests')
      .send({ name })
      .expect(201)
      .end((err, res) => {
        const { requests } = res.body.data;
        const latestRequest = requests[requests.length - 1];

        expect(res.statusCode).to.equal(201);
        expect(latestRequest.name).to.contain('Zoyal');
        done();
      });
  });

  it('Returns a 400 if a required field is absent when making a request to join a ride', (done) => {
    request(app)
      .post('/api/v1/rides/2/requests')
      .expect(400)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.contain('Required field missing');
        done();
      });
  });

  it('Gets all requests for ride offer', (done) => {
    request(app)
      .get('/api/v1/rides/1/requests')
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.data).to.be.instanceof(Array);
        done();
      });
  });

  it('Returns a 404 if a ride offer does not exist when trying to get offer requests', (done) => {
    request(app)
      .get('/api/v1/rides/0/requests')
      .expect(404)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.error).to.contain('Out of bounds');
        done();
      });
  });

  it('Returns a 400 if the "accept" property is absent when responding to a request to a ride offer', (done) => {
    request(app)
      .post('/api/v1/rides/2/requests/2')
      .expect(400)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.contain('Required field missing');
        done();
      });
  });

  it('Returns a 404 if a ride offer does not exist when responding to a request to a ride offer', (done) => {
    request(app)
      .post('/api/v1/rides/0/requests/2')
      .send({ accept: 'true' })
      .expect(404)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.error).to.contain('Out of bounds');
        done();
      });
  });

  it('Returns a 404 if a request does not exist when responding to a request to a ride offer', (done) => {
    request(app)
      .post('/api/v1/rides/1/requests/6')
      .send({ accept: 'true' })
      .expect(404)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.error).to.contain('Out of bounds');
        done();
      });
  });

  it('Correctly sets accepted property to true', (done) => {
    request(app)
      .post('/api/v1/rides/2/requests/2')
      .send({ accept: 'true' })
      .expect(201)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.requests[1].accepted).to.be.true;
        done();
      });
  });

  it('Correctly sets accepted property to false', (done) => {
    request(app)
      .post('/api/v1/rides/2/requests/2')
      .send({ accept: 'false' })
      .expect(201)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.data.requests[1].accepted).to.be.false;
        done();
      });
  });
});
