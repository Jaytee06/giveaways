const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const RoleCtrl = require('../controllers/role.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));

async function insert(req, res) {
    const roleCtrl = new RoleCtrl();
    let role = await roleCtrl.insert(req.body);
    res.json(role);
}

async function get(req, res) {
    const roleCtrl = new RoleCtrl();
    const roles = await roleCtrl.get(req.query);
    res.json(roles);
}

async function getById(req, res) {
    const roleCtrl = new RoleCtrl();
    const role = await roleCtrl.getById(req.params.id);
    res.json(role);
}

async function update(req, res) {
    const roleCtrl = new RoleCtrl();
    let role = await roleCtrl.update(req.params.id, req.body);
    res.json(role);
}

async function remove(req, res) {
    const roleCtrl = new RoleCtrl();
    await roleCtrl.remove(req.params.id);
    res.json();
}