const express = require('express');
const passport = require('passport');
const _ = require('lodash');
const asyncHandler = require('express-async-handler');
const StatusCtrl = require('../controllers/status.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', {session: false}));
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/count').get(asyncHandler(preQuery), asyncHandler(getCount));
router.route('/').post(asyncHandler(insert));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

async function preQuery(req, res, next) {
	if (req.query) {

		if( req.query.active === undefined )
			req.query.active = true;
	}

	let props = req.query.props;
	delete req.query.props;

	let paginationQuery = {};
	paginationQuery.skip = +req.query.skip || 0;
	// Zero limit for not pagination pages
	paginationQuery.limit = +req.query.limit || 0;
	delete req.query.skip;
	delete req.query.limit;

	if (req.query.sort) paginationQuery.sort = req.query.sort;
	delete req.query.sort;

	req.query = {
		query: req.query,
		paginationQuery,
		props
	};

	next();
}

async function insert(req, res) {
	let newStatus = req.body;
	const statusCtrl = new StatusCtrl();

	let status = await statusCtrl.insert(newStatus);
	res.json(status);
}

async function get(req, res) {
	const statusCtrl = new StatusCtrl();
	let statuses = await statusCtrl.get(req.query);

	res.json(statuses);
}

async function getCount(req, res) {
	const statusCtrl = new StatusCtrl();
	const count = await statusCtrl.getCount(req.query);
	res.json(count);
}

async function getById(req, res) {
	const statusCtrl = new StatusCtrl();
	const status = await statusCtrl.getById(req.params.id);
	res.json(status);
}

async function update(req, res) {
	const statusCtrl = new StatusCtrl();

	let status = await statusCtrl.update(req.params.id, req.body);
	res.json(status);
}

async function remove(req, res) {
	const statusCtrl = new StatusCtrl();
	await statusCtrl.remove(req.params.id);
	res.json(null);
}
