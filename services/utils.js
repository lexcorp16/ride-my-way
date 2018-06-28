const checkParams = (rideId, sizeOfData, res) => {
  if (rideId < 1 || rideId > sizeOfData) {
    return res.status(404).send({
      error: 'Out of bounds',
    });
  }
};

// from: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript

const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

const guid = () =>
  `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;

export {
  checkParams,
  guid,
};
