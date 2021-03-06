import cleanData from '../services/utils';

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const validateNigerianNumber = (phoneNumber) => {
  if (phoneNumber.match(/^(080|070|090|081)/gm)) {
    return phoneNumber.length === 11 ? null : 'Phone Number must be 11 digits.';
  } else if (phoneNumber.startsWith('+234')) {
    return phoneNumber.length === 14 ? null : 'Phone Number must be 14 digits.';
  }

  return 'Phone Number is not valid.';
};

const validateSignUpData = (req, res, next) => {
  const {
    email,
    password,
    phoneNumber,
    fullName,
  } = req.body;

  if (!email || !password || !phoneNumber || !cleanData(fullName)) {
    return res.status(400).send({
      status: 'failed',
      message: 'One of the following fields is missing; email, password, phoneNumber, fullName.',
    });
  } else if (!emailRegex.test(email)) {
    return res.status(400).send({
      status: 'falied',
      message: 'Email is invalid.',
    });
  } else if (validateNigerianNumber(phoneNumber) !== null) {
    return res.status(400).send({
      status: 'failed',
      message: validateNigerianNumber(phoneNumber),
    });
  }

  next();
};

const validateLoginData = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      status: 'failed',
      message: 'Email or Password not provided.',
    });
  } else if (!emailRegex.test(email)) {
    return res.status(400).send({
      status: 'failed',
      message: 'Email is invalid.',
    });
  }

  next();
};

export {
  validateSignUpData,
  validateLoginData,
};
