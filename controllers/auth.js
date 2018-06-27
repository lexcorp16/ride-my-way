import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import client from '../models/db';
import * as utils from '../services/utils';

dotenv.config();

const createUser = (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  client
    .query('INSERT INTO users(id, email, password) values($1, $2, $3) RETURNING *', [
      utils.guid(),
      email,
      hashedPassword,
    ])
    .then((response) => {
      const token = jwt.sign(
        { id: response.rows[0].id },
        process.env.JWTSECRET,
        { expiresIn: 86400 },
      );
      res
        .status(201)
        .send({
          success: true,
          authenticated: true,
          token,
          user: response.rows[0],
        });
    })
    .catch(() => {
      res.status(500).send({ success: false, error: 'An error occurred when signing up' });
    });
};

const logInUser = (req, res) => {
  const { email, password } = req.body;

  client
    .query('SELECT * FROM users WHERE email = $1', [email])
    .then((response) => {
      if (response.rowCount === 0) {
        return res.status(404).send({ success: false, error: 'No user exists with that email.' });
      }

      const passwordIsValid = bcrypt.compareSync(
        password,
        response.rows[0].password,
      );

      if (!passwordIsValid) {
        return res
          .status(401)
          .send({
            success: false,
            authenticated: false,
            token: null,
            error: 'Password is incorrect.',
          });
      }

      const token = jwt.sign({ id: response.rows[0].id }, process.env.JWTSECRET, {
        expiresIn: 86400,
      });

      return res.status(200).send({
        success: true,
        authenticated: true,
        token,
        user: response.rows[0],
      });
    })
    .catch(() => {
      res.status(500).send({ success: false, error: 'An error occurred when logging in' });
    });
};

export { createUser, logInUser };
