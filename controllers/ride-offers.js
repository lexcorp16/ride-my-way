import response from '../models/data';

const getAllRides = (req, res) => {
  res.status(200).send({
    response,
  });
};

export default getAllRides;
