const checkParams = (rideId, sizeOfData, res) => {
  if (rideId < 1 || rideId > sizeOfData) {
    return res.status(404).send({
      error: 'Out of bounds',
    });
  }
};

export default checkParams;
