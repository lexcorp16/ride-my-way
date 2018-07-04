const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const validateId = (req, res, next) => {
  if (!uuidRegex.test(req.params.rideId)) {
    return res.status(400).send({
      status: 'failed',
      message: 'ID supplied is invalid',
    });
  }

  next();
};

export default validateId;
