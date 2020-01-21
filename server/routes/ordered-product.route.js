const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctlr = require('../controllers/ordered-product.controller');
const TicketCtlr = require('../controllers/ticket.controller');
const requireRole = require('../middleware/require-role');
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');

const config = require('../config/config');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/counts').get(asyncHandler(getProductCounts));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

async function preQuery(req, res, next) {

    if( req.query ) {

        const skip = parseInt(req.query.skip) || 0;
        const limit = parseInt(req.query.limit) || 1000;
        let sortParam = req.query.sort || '-createdAt';
        delete req.query.skip;
        delete req.query.limit;
        delete req.query.sort;

        let sortDir = 1;
        if( sortParam.substr(0, 1) === '-' ) {
            sortDir = -1;
            sortParam = sortParam.substr(1);
        }
        const sort = {};
        sort[sortParam] = sortDir;

        req.query = {
            query: req.query,
            skip,
            limit,
            sort
        };
    }
    next();
}

async function insert(req, res) {
    const ctlr = new Ctlr();
    const ticketCtrl = new TicketCtlr();

    req.body.user = req.user._id;

    // first check if the user has enough tickets
    const ticketCount = ticketCtrl.myTicketCount(req.user._id);

    if( ticketCount.count < req.body.ticketAmount )
        return res.status(400).message("You do not have enough tickets for this item.");

    let orderedProduct = await ctlr.insert(req.body);

    // if it's successful then charge the ticket.
    if( orderedProduct ) {
        await ticketCtrl.insert({
           amount: orderedProduct.ticketAmount*-1,
           user: orderedProduct.user,
           reason: 'You redeemed tickets for a Store Item.',
           ref: orderedProduct.product,
           refType: 'orderedProduct'
        });

        const emailer = nodemailer.createTransport(smtpTransport(config.contactEmail));
        const mailOptions = {
            to: 'timpsonjared@yahoo.com',
            from: 'contact@vintley.com',
            subject: 'New Ordered Product on Vintley',
            html: 'You have a new ordered product to fulfill on vintley.<br> <a href="https://www.vintley.com/admin/ordered-products/'+orderedProduct._id+'">Order Product Page</a>',
            attachments: [],
        };

        emailer.sendMail(mailOptions, async (err) => {
            console.log('Email sent', err);
        });
    }

    res.json(orderedProduct);
}

async function get(req, res) {
    const ctlr = new Ctlr();

    const orderedProducts = await ctlr.get(req.query);
    res.json(orderedProducts);
}

async function getById(req, res) {
    const ctlr = new Ctlr();
    const orderedProduct = await ctlr.getById(req.params.id);
    res.json(orderedProduct);
}

async function update(req, res) {
    const ctlr = new Ctlr();

    let orderedProduct = await ctlr.update(req.params.id, req.body);
    res.json(orderedProduct);
}

async function remove(req, res) {
    const ctlr = new Ctlr();
    await ctlr.remove(req.params.id);
    res.json();
}

async function getProductCounts(req, res) {
    const ctlr = new Ctlr();

    // const counts = await ctlr.getProductCounts({query: req.query});
    // res.json(counts);
    res.json([]);
}