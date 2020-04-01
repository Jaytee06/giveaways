const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const PostCtrl = require('../controllers/post.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }));
router.use(requireRole);

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/count').get(asyncHandler(preQuery), asyncHandler(getCount));
router.route('/:id').get(asyncHandler(preQuery), asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));
router.route('/:id/comments').post(asyncHandler(createComment));
router.route('/:id/comments').get(asyncHandler(preQuery), asyncHandler(getComments));

async function preQuery(req, res, next) {
    if (req.query) {

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
    const postCtrl = new PostCtrl();

    req.body.author = req.user._id;

    let post = await postCtrl.insert(req.body);
    res.json(post);
}

async function get(req, res) {
    const postCtrl = new PostCtrl();
    const posts = await postCtrl.get(req.query);
    res.json(posts);
}

async function getById(req, res) {
    const postCtrl = new PostCtrl();
    const post = await postCtrl.getById(req.params.id);
    res.json(post);
}

async function update(req, res) {
    const postCtrl = new PostCtrl();
    let post = await postCtrl.update(req.params.id, req.body);
    res.json(post);
}

async function remove(req, res) {
    const postCtrl = new PostCtrl();
    await postCtrl.remove(req.params.id);
    res.json(null);
}

async function getCount(req, res) {
    const postCtrl = new PostCtrl();
    const count = await postCtrl.getCount(req.query);
    res.json(count);
}

async function createComment(req, res) {
    const postCtrl = new PostCtrl();

    req.body.user = req.user._id;

    let comment = await postCtrl.insertComment(req.params.id, req.body);
    if( comment )
        res.json(comment);
    else
        res.status(401).send("Something went wrong adding a comment.");
}

async function getComments(req, res) {
    const postCtrl = new PostCtrl();

    const comments = await postCtrl.getComments(req.params.id, req.query);
    res.json(comments);
}