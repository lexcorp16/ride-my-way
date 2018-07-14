import client from '../models/db';
import cleanData from '../services/utils';

const uuid = require('uuid');

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const validNumberRegex = /^\d+$/;

const getUserRides = (req, res) => {
  client
    .query('SELECT * from ride_offers WHERE user_id = $1', [req.userId])
    .then((rides) => {
      res.status(200).send({
        status: 'success',
        data: rides.rows,
        message: `${rides.rowCount} Ride Offer(s) found`,
      });
    })
    .catch(() => {
      res.status(500).send({
        status: 'error',
        message: 'An error occurred fetching ride offers.',
      });
    });
};

const getUserRequests = (req, res) => {
  client
    .query('SELECT * from requests WHERE user_id = $1', [req.userId])
    .then((requests) => {
      res.status(200).send({
        status: 'success',
        data: requests.rows,
        message: `${requests.rowCount} Request(s) found`,
      });
    })
    .catch(() => {
      res.status(500).send({
        status: 'error',
        message: 'An error occurred fetching requests.',
      });
    });
};

const getAllRides = (req, res) => {
  const { destination, startingPoint } = req.query;

  if (destination && startingPoint) {
    client
      .query('SELECT * from ride_offers WHERE destination = $1 AND point_of_departure = $2', [destination.toLowerCase(), startingPoint.toLowerCase()])
      .then((rides) => {
        return res.status(200).send({
          status: 'success',
          data: rides.rows,
          message: `${rides.rowCount} Rides found`,
        });
      })
      .catch(() => {
        return res.status(500).send({
          status: 'error',
          message: 'An error occurred fetching ride offers.',
        });
      });
  }
  client
    .query('SELECT * from ride_offers')
    .then((rides) => {
      res.status(200).send({
        status: 'success',
        data: rides.rows,
        message: `${rides.rowCount} Ride Offer(s) found`,
      });
    })
    .catch(() => {
      res.status(500).send({
        status: 'error',
        message: 'An error occurred fetching ride offers.',
      });
    });
};

const getOneRide = (req, res) => {
  const { rideId } = req.params;

  client
    .query('SELECT * from ride_offers WHERE id = $1', [rideId])
    .then((ride) => {
      if (ride.rowCount === 0) {
        return res.status(404).send({
          status: 'error',
          message: 'Ride offer with that id does not exist.',
        });
      }
      res.status(200).send({
        status: 'success',
        data: ride.rows[0],
        message: 'Specified ride offer found.',
      });
    })
    .catch(() => {
      res.status(500).send({
        status: 'error',
        message: 'An error occurred fetching details of ride offer.',
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
    !validNumberRegex.test(vehicleCapacity) ||
    !cleanData(destination) ||
    !departureTime ||
    !cleanData(pointOfDeparture) ||
    !departureDate
  ) {
    return res.status(400).send({
      status: 'failed',
      message: 'One of the following fields is missing; destination, vehicleCapacity, departureTime, pointOfDeparture, departureDate.',
    });
  }

  client.query('SELECT * FROM ride_offers WHERE user_id = $1 AND departure_time = $2 AND departure_date = $3', [req.userId, departureTime, departureDate]).then((ride) => {
    if (ride.rowCount > 0) {
      return res.status(400).send({
        status: 'failed',
        message: 'You already have a ride scheduled for this period.',
      });
    }

    client
      .query(
        'INSERT INTO ride_offers(id, user_id, destination, point_of_departure, vehicle_capacity, departure_time, departure_date) values($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [
          uuid(),
          req.userId,
          destination.toLowerCase(),
          pointOfDeparture.toLowerCase(),
          vehicleCapacity,
          departureTime,
          departureDate,
        ],
      )
      .then((resp) => {
        res.status(201).send({
          status: 'success',
          data: resp.rows[0],
          message: 'Ride offer successfully created.',
        });
      })
      .catch(() => {
        res
          .status(500)
          .send({ status: 'error', message: 'An error occurred when creating ride offer.' });
      });
  }).catch(() => {
    res
      .status(500)
      .send({ status: 'error', message: 'An unexpected error occurred.' });
  });
};

const joinRide = (req, res) => {
  const { rideId } = req.params;

  client
    .query('SELECT * FROM ride_offers WHERE id = $1', [rideId])
    .then((ride) => {
      if (ride.rowCount === 0) {
        return res.status(404).send({
          status: 'failed',
          message: 'A ride with that ID does not exist',
        });
      } else if (ride.rows[0].user_id === req.userId) {
        return res.status(400).send({
          status: 'failed',
          message: 'You cannot join a ride offer you have created.',
        });
      } else if (ride.rows[0].vehicle_capacity === 0) {
        return res.status(400).send({
          status: 'failed',
          message: 'All seats for this ride offer have been booked.',
        });
      }
      client.query('SELECT * from requests WHERE ride_id = $1 AND user_id = $2', [rideId, req.userId]).then((request) => {
        if (request.rowCount > 0) {
          return res.status(400).send({
            status: 'failed',
            message: 'You have already made a request for this ride offer.',
          });
        }

        client.query('SELECT * from users WHERE id = $1', [req.userId]).then((user) => {
          client
            .query(
              'INSERT INTO requests(id, ride_id, user_id, name) values($1, $2, $3, $4) RETURNING *',
              [uuid(), rideId, req.userId, user.rows[0].full_name],
            )
            .then((data) => {
              res.status(201).send({
                status: 'success',
                data: data.rows[0],
                message: 'Joined ride successfully',
              });
            })
            .catch(() => {
              res.status(500).send({
                status: 'error',
                message: 'An error occurred when trying to make a request to a ride offer.',
              });
            });
        }).catch(() => {
          res
            .status(500)
            .send({ status: 'error', message: 'An unexpected error occured.' });
        });
      }).catch(() => {
        res
          .status(500)
          .send({ status: 'error', message: 'An unexpected error occured.' });
      });
    })
    .catch(() => {
      res
        .status(500)
        .send({ status: 'error', message: 'An unexpected error occured.' });
    });
};

const getOfferRequests = (req, res) => {
  const { rideId } = req.params;

  client.query('SELECT * from ride_offers WHERE id = $1', [rideId]).then((ride) => {
    if (ride.rows[0].user_id !== req.userId) {
      return res.status(403).send({
        status: 'failed',
        message: 'You cannot view requests for ride offers created by others.',
      });
    }

    client
      .query('SELECT * from requests where ride_id = $1', [rideId])
      .then((request) => {
        res.status(200).send({
          status: 'success',
          data: request.rows,
          message: `${request.rowCount} offer request(s) found`,
        });
      })
      .catch(() => {
        res.status(500).send({
          status: 'error',
          message: 'An error occurred fetching requests.',
        });
      });
  }).catch(() => {
    res.status(500).send({
      status: 'error',
      message: 'An unexpected error occured.',
    });
  });
};

const respondToRideRequest = (req, res) => {
  const { status } = req.body;
  const { rideId, requestId } = req.params;

  const validStatus = ['accepted', 'rejected'];

  if (!status) {
    return res.status(400).send({
      status: 'failed',
      message: 'status field is missing. Please supply "acepted" or "rejected"',
    });
  }

  if (!validStatus.includes(status.toLowerCase())) {
    return res.status(400).send({
      status: 'failed',
      message: 'status field supplied is invalid. Please supply "acepted" or "rejected"',
    });
  }

  if (!uuidRegex.test(rideId) || !uuidRegex.test(requestId)) {
    return res.status(400).send({
      status: 'failed',
      message: 'ID supplied is invalid',
    });
  }

  client
    .query('SELECT * from requests where ride_id = $1 AND id = $2', [rideId, requestId])
    .then((request) => {
      if (request.rowCount === 0) {
        return res.status(404).send({
          status: 'failed',
          message: 'The specified request does not exist.',
        });
      } else if (request.rows[0].status !== 'pending') {
        return res.status(400).send({
          status: 'failed',
          message: 'You have already responded to this request.',
        });
      }

      client.query('SELECT * FROM ride_offers WHERE id = $1', [rideId]).then((ride) => {
        if (ride.rows[0].user_id === req.userId) {
          if (status === 'accepted') {
            client.query('UPDATE ride_offers SET vehicle_capacity = vehicle_capacity - 1 WHERE id = $1 AND vehicle_capacity > 0 RETURNING *', [rideId]).catch(err => console.log(err));
          }

          client
            .query(
              'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
              [status, requestId],
            )
            .then((data) => {
              res.status(200).send({
                status: 'success',
                data: data.rows[0],
                message: 'Successfully responded to ride offer request.',
              });
            })
            .catch(() => {
              res.status(500).send({
                status: 'error',
                message: 'An error occured when responding to ride offer request.',
              });
            });
        } else {
          res.status(403).send({
            status: 'error',
            message: 'You are not permitted to respond to this request.',
          });
        }
      }).catch(() => {
        res.status(500).send({
          status: 'error',
          message: 'An unexpected error occurred.',
        });
      });
    });
};

const deleteRideOffer = (req, res) => {
  const { rideId } = req.params;

  client
    .query('SELECT * FROM ride_offers WHERE id = $1', [rideId])
    .then((ride) => {
      if (ride.rowCount === 0) {
        return res.status(404).send({
          status: 'failed',
          message: 'A ride with that ID does not exist.',
        });
      } else if (ride.rows[0].user_id === req.userId) {
        client.query('DELETE FROM ride_offers WHERE id = $1', [rideId]).then((deletedRide) => {
          res.status(200).send({
            status: 'success',
            message: `${deletedRide.rowCount} Ride Offer(s) deleted successfully.`,
          });
        }).catch(() => {
          res.status(500).send({
            status: 'error',
            message: 'An error occured deleting the ride offer.',
          });
        });
      } else {
        return res.status(403).send({
          status: 'failed',
          message: 'You are not permitted to delete this ride offer.',
        });
      }
    }).catch(() => {
      res.status(500).send({
        status: 'error',
        message: 'An unexpected error occurred.',
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
  deleteRideOffer,
  getUserRides,
  getUserRequests,
};
