/* eslint no-unused-expressions: 0 */

import chai from 'chai';
import request from 'supertest';

import app from '../index';

const { expect } = chai;

describe('API tests', () => {
  it('Gets all rides', (done) => {
    request(app)
      .get('/api/v1/rides')
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.response).to.not.be.undefined;
        done();
      });
  });
});
