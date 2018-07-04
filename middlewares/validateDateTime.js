const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
const timeRegex = /^\d{1,2}:\d{2}([ap]m)?$/;

const validateDateTime = (req, res, next) => {
  const { departureTime, departureDate } = req.body;

  if (!departureDate.match(dateRegex)) {
    return res.status(400).send({
      status: 'failed',
      message: 'Please enter a date in this format dd/mm/yyyy',
    });
  } else if (!departureTime.match(timeRegex)) {
    return res.status(400).send({
      status: 'failed',
      message: 'Please enter a time in this format hh:mm',
    });
  }

  next();
};

export default validateDateTime;
