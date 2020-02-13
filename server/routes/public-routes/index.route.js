const express = require('express');

const raffleRoutes = require('./raffle.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK'),
);

router.use('/raffle', raffleRoutes);

module.exports = router;
