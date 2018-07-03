import jwt from 'jsonwebtoken';

const verifyLogin = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      status: 'error',
      authenticated: false,
      message: 'You need to login to access this route.',
    });
  }

  jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    if (err) {
      return res.status(500).send({
        status: 'error',
        authenticated: false,
        message: 'Failed to authenticate token. Please try to login again.',
      });
    }

    req.userId = decoded.id;
    next();
  });
};

export default verifyLogin;
