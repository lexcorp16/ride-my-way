const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
const timeRegex = /^\d{1,2}:\d{2}([ap]m)?$/;

const validateDateTime = (req, res, next) => {
  const { departureTime, departureDate } = req.body;

  if (!dateRegex.test(departureDate) || +departureDate.split('/')[0] > 12) {
    return res.status(400).send({
      status: 'failed',
      message: 'Please enter a date in this format mm/dd/yyyy',
    });
  } else if (!timeRegex.test(departureTime)) {
    return res.status(400).send({
      status: 'failed',
      message: 'Please enter a time in this format hh:mm',
    });
  } else if (Date.parse(departureDate) < +new Date()) {
    return res.status(400).send({
      status: 'failed',
      message: 'Please enter a date in the future.',
    });
  }

  next();
};

export default validateDateTime;
