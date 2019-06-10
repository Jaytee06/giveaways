const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const PermissionCtrl = require('../controllers/permission.controller');
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
    const permissionCtrl = new PermissionCtrl();
    let permission = await permissionCtrl.insert(req.body);
    res.json(permission);
}

async function get(req, res) {
    const permissionCtrl = new PermissionCtrl();
    const permissions = await permissionCtrl.get(req.query);
    res.json(permissions);
}

async function getById(req, res) {
    const permissionCtrl = new PermissionCtrl();
    const permission = await permissionCtrl.getById(req.params.id);
    res.json(permission);
}

async function update(req, res) {
    const permissionCtrl = new PermissionCtrl();
    let permission = await permissionCtrl.update(req.params.id, req.body);
    res.json(permission);
}

async function remove(req, res) {
    const permissionCtrl = new PermissionCtrl();
    await permissionCtrl.remove(req.params.id);
    res.json(null);
}