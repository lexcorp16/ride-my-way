import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import client from '../models/db';

const uuid = require('uuid/v1');

dotenv.config();

const createUser = (req, res) => {
  const {
    email,
    password,
    fullName,
    phoneNumber,
  } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  client.query('SELECT * FROM users WHERE email = $1', [email]).then((resp) => {
    if (resp.rowCount > 0) {
      return res.status(409).send({
        status: 'failed',
        message: 'A user with that email already exists.',
      });
    }
    client
      .query('INSERT INTO users(id, full_name, phone_number, email, password, created_at, updated_at) values($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *', [
        uuid(),
        fullName,
        phoneNumber,
        email,
        hashedPassword,
      ])
      .then((user) => {
        const token = jwt.sign(
          { id: user.rows[0].id },
          process.env.JWTSECRET,
          { expiresIn: 86400 },
        );
        res
          .status(201)
          .send({
            status: 'success',
            message: 'You are successfully registered.',
            token,
            user: {
              id: user.rows[0].id,
              email: user.rows[0].email,
              fullName: user.rows[0].full_name,
              phoneNumber: user.rows[0].phone_number,
              createdAt: user.rows[0].created_at,
              updatedAt: user.rows[0].updated_at,
            },
          });
      })
      .catch(() => {
        res.status(500).send({ status: 'error', message: 'An error occurred when signing up.' });
      });
  });
};

const logInUser = (req, res) => {
  const { email, password } = req.body;

  client
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then((user) => {
      if (user.rowCount === 0) {
        return res.status(404).send({ status: 'failed', message: 'No user exists with that email.' });
      }

      const passwordIsValid = bcrypt.compareSync(
        password,
        user.rows[0].password,
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({
            status: 'failed',
            token: null,
            message: 'Email or Password is incorrect.',
          });
      }

      const token = jwt.sign({ id: user.rows[0].id }, process.env.JWTSECRET, {
        expiresIn: 86400,
      });

      return res.status(200).send({
        status: 'success',
        message: 'You are successfully login.',
        token,
        user: {
          id: user.rows[0].id,
          email: user.rows[0].email,
          fullName: user.rows[0].full_name,
          phoneNumber: user.rows[0].phone_number,
          createdAt: user.rows[0].created_at,
          updatedAt: user.rows[0].updated_at,
        },
      });
    })
    .catch(() => {
      res.status(500).send({ status: 'error', message: 'An error occurred when logging in.' });
    });
};

export { createUser, logInUser };
