const express = require('express');

const blogRoutes = require('./blog.route');
const categoryRoutes = require('./category.route');
const raffleRoutes = require('./raffle.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK'),
);

router.use('/blog', blogRoutes);
router.use('/category', categoryRoutes);
router.use('/raffle', raffleRoutes);

module.exports = router;
