import client from '../models/db';

const uuid = require('uuid');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getAllRides = (req, res) => {
  const { destination, startingPoint } = req.query;

  if (destination && startingPoint) {
    client
      .query('SELECT * from ride_offers WHERE destination = $1 AND point_of_departure = $2', [destination, startingPoint])
      .then((resp) => {
        res.status(200).send({
          success: true,
          data: resp.rows,
          message: `${resp.rowCount} Rides round`,
        });
      })
      .catch(() => {
        res.status(500).send({
          success: false,
          error: 'An error occurred fetching ride offers.',
        });
      });
  }
  client
    .query('SELECT * from ride_offers')
    .then((resp) => {
      res.status(200).send({
        success: true,
        data: resp.rows,
      });
    })
    .catch(() => {
      res.status(500).send({
        success: false,
        error: 'An error occurred fetching ride offers.',
      });
    });
};

const getOneRide = (req, res) => {
  const { rideId } = req.params;

  if (!uuidRegex.test(rideId)) {
    return res.status(400).send({
      success: false,
      error: 'ID supplied is invalid',
    });
  }

  client
    .query('SELECT * from ride_offers WHERE id = $1', [rideId])
    .then((resp) => {
      if (resp.rowCount === 0) {
        return res.status(404).send({
          success: false,
          error: 'Ride offer with that id does not exist.',
        });
      }
      res.status(200).send({
        success: true,
        data: resp.rows[0],
      });
    })
    .catch(() => {
      res.status(500).send({
        success: false,
        error: 'An error occurred fetching details of ride offer.',
      });
    });
};

const createRideOffer = (req, res) => {
  const {
    destination,
    departureTime,
    pointOfDeparture,
    vehicleCapacity,
    departureDate,
  } = req.body;

  if (
    !vehicleCapacity ||
    !destination ||
    !departureTime ||
    !pointOfDeparture ||
    !departureDate
  ) {
    return res.status(400).send({
      success: false,
      error: 'A Required field is missing.',
    });
  }

  client
    .query(
      'INSERT INTO ride_offers(id, user_id, destination, point_of_departure, vehicle_capacity, departure_time, departure_date) values($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        uuid(),
        req.userId,
        destination,
        pointOfDeparture,
        vehicleCapacity,
        departureTime,
        departureDate,
      ],
    )
    .then((resp) => {
      res.status(201).send({
        success: true,
        data: resp.rows[0],
      });
    })
    .catch(() => {
      res
        .status(500)
        .send({ success: false, error: 'An error occurred when creating ride offer.' });
    });
};

const joinRide = (req, res) => {
  const { rideId } = req.params;

  if (!uuidRegex.test(rideId)) {
    return res.status(400).send({
      success: false,
      error: 'ID supplied is invalid',
    });
  }

  client
    .query('SELECT * FROM ride_offers WHERE id = $1', [rideId])
    .then((resp) => {
      if (resp.rowCount === 0) {
        return res.status(404).send({
          success: false,
          error: 'A ride with that ID does not exist',
        });
      }
      client
        .query(
          'INSERT INTO requests(id, ride_id, user_id) values($1, $2, $3) RETURNING *',
          [uuid(), rideId, req.userId],
        )
        .then((data) => {
          res.status(201).send({
            success: true,
            data: data.rows[0],
          });
        })
        .catch(() => {
          res.status(500).send({
            success: false,
            error: 'An error occurred when trying to make a request to a ride offer.',
          });
        });
    })
    .catch(() => {
      res
        .status(500)
        .send({ success: false, error: 'An unexpected error occured.' });
    });
};

const getOfferRequests = (req, res) => {
  const { rideId } = req.params;

  if (!uuidRegex.test(rideId)) {
    return res.status(400).send({
      success: false,
      error: 'ID supplied is invalid',
    });
  }

  client
    .query('SELECT * from requests where ride_id = $1', [rideId])
    .then((resp) => {
      res.status(200).send({
        success: true,
        data: resp.rows,
      });
    })
    .catch(() => {
      res.status(500).send({
        success: false,
        error: 'An error occurred fetching requests.',
      });
    });
};

const respondToRideRequest = (req, res) => {
  const { status } = req.body;
  const { rideId, requestId } = req.params;

  const validStatus = ['accepted', 'rejected'];

  if (!validStatus.includes(status.toLowerCase())) {
    return res.status(400).send({
      success: false,
      error: 'status field supplied is invalid. Please supply "acepted" or "rejected"',
    });
  }

  if (!uuidRegex.test(rideId) || !uuidRegex.test(rideId)) {
    return res.status(400).send({
      success: false,
      error: 'ID supplied is invalid',
    });
  }

  client
    .query('SELECT * from requests where ride_id = $1 AND id = $2', [rideId, requestId])
    .then((resp) => {
      if (resp.rowCount === 0) {
        res.status(404).send({
          success: false,
          error: 'The specified request does not exist.',
        });
      } else if (resp.rows[0].user_id === req.userId) {
        client
          .query(
            'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
            [status, requestId],
          )
          .then((data) => {
            res.status(201).send({
              success: true,
              data: data.rows[0],
            });
          })
          .catch(() => {
            res.status(500).send({
              success: false,
              error: 'An error occured when responding to ride offer request.',
            });
          });
      } else {
        res.status(400).send({
          success: true,
          error: 'You are not permitted to respond to this request.',
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        success: false,
        error: 'An unexpected error occurred.',
      });
    });
};

export {
  getAllRides,
  getOneRide,
  createRideOffer,
  joinRide,
  getOfferRequests,
  respondToRideRequest,
};
