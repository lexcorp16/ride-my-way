/* eslint no-unused-expressions: 0 */

import chai from 'chai';
import request from 'supertest';

import client from '../models/db';

import app from '../index';

const { expect } = chai;

describe('Authentication tests', () => {
  before(() => client.query('CREATE TABLE users(id UUID PRIMARY KEY, email VARCHAR(40) not null unique, password VARCHAR(255) not null)'));

  after(() => client.query('DROP TABLE users'));

  it('Registers a new user', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
      password: 'supersecret',
    };

    request(app)
      .post('/auth/signup')
      .send({ email: userDetails.email, password: userDetails.password })
      .expect(201)
      .end((err, res) => {
        expect(res.statusCode).to.equal(201);
        expect(res.body.token).to.not.be.undefined;
        expect(res.body.authenticated).to.be.true;
        done();
      });
  });

  it('Returns a 400 if the email is invalid when signing up', (done) => {
    const userDetails = {
      email: 'crappy email',
      password: 'supersecret',
    };

    request(app)
      .post('/auth/signup')
      .send({ email: userDetails.email, password: userDetails.password })
      .expect(400)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.contain('Email is invalid.');
        done();
      });
  });

  it('Returns a 400 if the email is missing when signing up', (done) => {
    const userDetails = {
      password: 'supersecret',
    };

    request(app)
      .post('/auth/signup')
      .send({ password: userDetails.password })
      .expect(400)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.contain('Email or Password not provided.');
        done();
      });
  });

  it('Logs in an existing user', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
      password: 'supersecret',
    };

    request(app)
      .post('/auth/login')
      .send({ email: userDetails.email, password: userDetails.password })
      .expect(200)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body.token).to.not.be.undefined;
        expect(res.body.authenticated).to.be.true;
        done();
      });
  });

  it('Returns a 401 if password is incorrect when logging in', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
      password: 'myNotSoGreatPassword',
    };

    request(app)
      .post('/auth/login')
      .send({ email: userDetails.email, password: userDetails.password })
      .expect(401)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body.authenticated).to.be.false;
        expect(res.body.error).to.contain('Password is incorrect.');
        done();
      });
  });

  it('Returns a 404 if no user is found when trying to login', (done) => {
    const userDetails = {
      email: 'unregistered@gmail.com',
      password: 'password',
    };

    request(app)
      .post('/auth/login')
      .send({ email: userDetails.email, password: userDetails.password })
      .expect(404)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body.error).to.contain('No user exists with that email.');
        done();
      });
  });

  it('Returns a 400 if a feild is missing when trying to login', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
    };

    request(app)
      .post('/auth/signup')
      .send({ email: userDetails.email })
      .expect(400)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body.error).to.contain('Email or Password not provided.');
        done();
      });
  });
});
