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

  it('Returns a 404 if a ride offer does not exist', (done) => {
    request(app)
      .get('/api/v1/rides/0')
      .expect(404)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.error).to.contain('Out of bounds');
        done();
      });
  });
});
