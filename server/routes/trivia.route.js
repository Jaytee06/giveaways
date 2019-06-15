const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctrl = require('../controllers/trivia.controller');
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
router.route('/:id/generate-questions').get(asyncHandler(generateQuestions));

async function insert(req, res) {
    const ctrl = new Ctrl();
    const nTrivia = req.body;

    // mark who created it.
    nTrivia.user = req.user._id;

    let trivia = await ctrl.insert(nTrivia);
    res.json(trivia);
}

async function get(req, res) {
    const ctrl = new Ctrl();
    const trivias = await ctrl.get(req.query);
    res.json(trivias);
}

async function getById(req, res) {
    const ctrl = new Ctrl();
    const trivia = await ctrl.getById(req.params.id);
    res.json(trivia);
}

async function update(req, res) {
    const ctrl = new Ctrl();
    const uTrivia = req.body;

    // can't update
    delete uTrivia.user;

    let trivia = await ctrl.update(req.params.id, uTrivia);
    res.json(trivia);
}

async function remove(req, res) {
    const ctrl = new Ctrl();
    await ctrl.remove(req.params.id);
    res.json();
}

async function generateQuestions(req, res) {
    const ctrl = new Ctrl();
    let questionsAndAnswers = await ctrl.generateQuestions(req.params.id);
    let quiz = await ctrl.getById(req.params.id);
    quiz.questions = questionsAndAnswers.questions;
    quiz.questionAnswers = questionsAndAnswers.answers;
    await ctrl.update(req.params.id, quiz);
    res.json(questionsAndAnswers.questions);
}