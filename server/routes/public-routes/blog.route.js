const express = require('express');
const asyncHandler = require('express-async-handler');
const Ctlr = require('../../controllers/post.controller');

const router = express.Router();
module.exports = router;

router.route('/').get(asyncHandler(preQuery), asyncHandler(get));
router.route('/:title').get(asyncHandler(getByTitle));
router.route('/:id/comments').get(asyncHandler(preQuery), asyncHandler(getComments));

async function preQuery(req, res, next) {

    const orArray = [];
    const andArray = [];

    if( req.query.categories ) {
        req.query.categories.forEach((catId) => {
            orArray.push({categories:{$in:[catId]}});
        });
        delete req.query.categories;
    }

    if( orArray.length )
        andArray.push({'$or': orArray});

    if( andArray.length )
        req.query['$and'] = andArray;

    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || '-createdAt';
    const groupBy = req.query.groupBy;
    delete req.query.skip;
    delete req.query.limit;
    delete req.query.sort;
    delete req.query.groupBy;

    req.query = {
        query: req.query,
        skip,
        limit,
        sort,
        groupBy
    };

    next();
}

async function get(req, res) {
    const ctlr = new Ctlr();
    const posts = await ctlr.get(req.query);

    res.json(posts);
}

async function getByTitle(req, res) {
    const ctlr = new Ctlr();
    const post = await ctlr.getByTitle(req.params.title);

    if( post ) {
        res.json(post);
    } else {
        res.status(400).send('Could not find post.');
    }
}

async function getComments(req, res) {
    const ctlr = new Ctlr();

    const comments = await ctlr.getComments(req.params.id, req.query);
    res.json(comments);
}