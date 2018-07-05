/* eslint no-unused-expressions: 0 */

import chai from 'chai';
import request from 'supertest';

import client from '../models/db';

import app from '../index';

const { expect } = chai;

describe('Authentication tests', () => {
  before(() => client.query('CREATE TABLE users(id UUID PRIMARY KEY, full_name VARCHAR(100) not null, phone_number VARCHAR(14) not null, email VARCHAR(40) not null unique, password VARCHAR(255) not null, created_at timestamp with time zone not null, updated_at timestamp with time zone not null)'));

  after(() => client.query('DROP TABLE users'));

  it('Registers a new user', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
      password: 'supersecret',
      fullName: 'Tosin Ambode',
      phoneNumber: '08023562717',
    };

    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: userDetails.email,
        password: userDetails.password,
        fullName: userDetails.fullName,
        phoneNumber: userDetails.phoneNumber,
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.user.email).to.contain('awesomeemail@gmail.com');
        expect(res.body.user.fullName).to.contain('Tosin Ambode');
        done();
      });
  });

  it('Returns a 409 if user already exists when signing up', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
      password: 'supersecret',
      fullName: 'Tosin Ambode',
      phoneNumber: '08023562717',
    };

    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: userDetails.email,
        password: userDetails.password,
        fullName: userDetails.fullName,
        phoneNumber: userDetails.phoneNumber,
      })
      .expect(409)
      .end((err, res) => {
        expect(res.body.message).to.contain('A user with that email already exists.');
        done();
      });
  });

  it('Returns a 400 if the email is invalid when signing up', (done) => {
    const userDetails = {
      email: 'crappy email',
      password: 'supersecret',
      fullName: 'Tosin Ambode',
      phoneNumber: '08023562717',
    };

    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: userDetails.email,
        password: userDetails.password,
        fullName: userDetails.fullName,
        phoneNumber: userDetails.phoneNumber,
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.contain('Email is invalid.');
        done();
      });
  });

  it('Returns a 400 if the phone number is invalid when signing up', (done) => {
    const userDetails = {
      email: 'newuser@gmail.com',
      password: 'supersecret',
      fullName: 'Tosin Ambode',
      phoneNumber: '124425522662',
    };

    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: userDetails.email,
        password: userDetails.password,
        fullName: userDetails.fullName,
        phoneNumber: userDetails.phoneNumber,
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.contain('Phone Number is not valid.');
        done();
      });
  });

  it('Returns a 400 if the phone number is badly formatted with "+234" when signing up', (done) => {
    const userDetails = {
      email: 'newuser@gmail.com',
      password: 'supersecret',
      fullName: 'Tosin Ambode',
      phoneNumber: '+23408033882972',
    };

    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: userDetails.email,
        password: userDetails.password,
        fullName: userDetails.fullName,
        phoneNumber: userDetails.phoneNumber,
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.contain('Phone Number must be 14 digits.');
        done();
      });
  });

  it('Returns a 400 if the phone number is badly formatted without "+234" when signing up', (done) => {
    const userDetails = {
      email: 'newuser@gmail.com',
      password: 'supersecret',
      fullName: 'Tosin Ambode',
      phoneNumber: '0803388297',
    };

    request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: userDetails.email,
        password: userDetails.password,
        fullName: userDetails.fullName,
        phoneNumber: userDetails.phoneNumber,
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.contain('Phone Number must be 11 digits.');
        done();
      });
  });

  it('Returns a 400 if the email is missing when signing up', (done) => {
    const userDetails = {
      password: 'supersecret',
    };

    request(app)
      .post('/api/v1/auth/signup')
      .send({ password: userDetails.password })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.contain('One of the following fields is missing; email, password, phoneNumber, fullName.');
        done();
      });
  });

  it('Logs in an existing user', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
      password: 'supersecret',
    };

    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userDetails.email,
        password: userDetails.password,
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.token).to.not.be.null;
        expect(res.body.user.email).to.contain('awesomeemail@gmail.com');
        done();
      });
  });

  it('Returns a 401 if password is incorrect when logging in', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
      password: 'myNotSoGreatPassword',
    };

    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userDetails.email,
        password: userDetails.password,
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body.token).to.be.null;
        expect(res.body.message).to.contain('Email or Password is incorrect.');
        done();
      });
  });

  it('Returns a 404 if no user is found when trying to login', (done) => {
    const userDetails = {
      email: 'unregistered@gmail.com',
      password: 'password',
    };

    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userDetails.email,
        password: userDetails.password,
      })
      .expect(404)
      .end((err, res) => {
        expect(res.body.message).to.contain('Email or Password is incorrect.');
        done();
      });
  });

  it('Returns a 400 if a feild is missing when trying to login', (done) => {
    const userDetails = {
      email: 'awesomeemail@gmail.com',
    };

    request(app)
      .post('/api/v1/auth/login')
      .send({ email: userDetails.email })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.contain('Email or Password not provided.');
        done();
      });
  });

  it('Returns a 400 if a email is invalid when trying to login', (done) => {
    const userDetails = {
      email: 'mail.com',
      password: 'badpassword',
    };

    request(app)
      .post('/api/v1/auth/login')
      .send({
        email: userDetails.email,
        password: userDetails.password,
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.message).to.contain('Email is invalid.');
        done();
      });
  });
});
