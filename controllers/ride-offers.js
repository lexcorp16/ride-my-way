import response from '../models/data';

const SIZE_OF_DATA = response.data.length;

const getAllRides = (req, res) => {
  res.status(200).send({
    response,
  });
};

const getOneRide = (req, res) => {
  if (req.params.rideId < 1 || req.params.rideId > SIZE_OF_DATA) {
    return res.status(404).send({
      error: 'Out of bounds',
    });
  }
  return res.status(200).send({
    data: response.data[req.params.rideId - 1],
  });
};

const createRideOffer = (req, res) => {
  const {
    driver,
    destination,
    departureTime,
    pointOfDeparture,
  } = req.body;

  if (!driver || !destination || !departureTime || !pointOfDeparture) {
    return res.status(400).send({
      error: 'Required field missing',
    });
  }

  const id = response.data.length + 1;

  response.data.push({
    id,
    driver,
    departureTime,
    destination,
    pointOfDeparture,
    requests: [],
  });

  return res.status(201).send({
    data: response.data[id - 1],
  });
};

export { getAllRides, getOneRide, createRideOffer };
