const express = require('express');
const authRoutes = require('./auth.route');
const callCenterRoutes = require('./call-center.route');
const companyRoutes = require('./company.route');
const partnerRoutes = require('./partner.route');
const permissionRoutes = require('./permission.route');
const raffleRoutes = require('./raffle.route');
const roleRoutes = require('./role.route');
const statusRoutes = require('./status.route');
const ticketRoutes = require('./ticket.route');
const ticketOppRoutes = require('./ticket-opportunity.route');
const triviaRoutes = require('./trivia.route');
const userRoutes = require('./user.route');

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/call-center', callCenterRoutes);
router.use('/company', companyRoutes);
router.use('/partner', partnerRoutes);
router.use('/permission', permissionRoutes);
router.use('/raffle', raffleRoutes);
router.use('/role', roleRoutes);
router.use('/status', statusRoutes);
router.use('/ticket', ticketRoutes);
router.use('/ticket-opportunity', ticketOppRoutes);
router.use('/trivia', triviaRoutes);
router.use('/user', userRoutes);

module.exports = router;
