const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const Ctrl = require('../controllers/trivia.controller');
const TicketCtrl = require('../controllers/ticket.controller');
const requireRole = require('../middleware/require-role');

const router = express.Router();
module.exports = router;

router.use(passport.authenticate('jwt', { session: false }))
router.use(requireRole);

router.route('/').get(asyncHandler(get));
router.route('/').post(asyncHandler(insert));
router.route('/current').get(asyncHandler(current));
router.route('/:id').get(asyncHandler(getById));
router.route('/:id').put(asyncHandler(update));
router.route('/:id').delete(asyncHandler(remove));
router.route('/:id/generate-questions').get(asyncHandler(generateQuestions));
router.route('/:id/calculate-tickets').get(asyncHandler(calculateTickets));
router.route('/:id/join-user/:userId').post(asyncHandler(insertUserTrivia));
router.route('/:id/user-trivia/:userId').get(asyncHandler(findUserTrivia));
router.route('/user-trivia/:id').get(asyncHandler(getUserTriviaById));
router.route('/user-trivia/:id').put(asyncHandler(updateUserTrivia));

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

    // don't allow answers to go to the front end
    trivias.forEach((trivia) => {
        delete trivia.questionAnswers;
    });

    res.json(trivias);
}

async function getById(req, res) {
    const ctrl = new Ctrl();
    const trivia = await ctrl.getById(req.params.id);

    // don't allow answers to go to the front end
    delete trivia.questionAnswers;

    console.log(trivia.questionAnswers);
    res.json(trivia);
}

async function update(req, res) {
    const ctrl = new Ctrl();
    const uTrivia = req.body;

    // can't update
    delete uTrivia.user;

    let trivia = await ctrl.update(req.params.id, uTrivia);

    // don't allow answers to go to the front end
    delete trivia.questionAnswers;

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

async function current(req, res) {
    const ctrl = new Ctrl();
    const pastTrivias = await ctrl.get({start:{$lt:new Date()}}, {limit:2}, "-start");
    pastTrivias.sort((a, b) => new Date(a.start) - new Date(b.start));
    const upcommingTrivias = await ctrl.get({start:{$gt:new Date()}}, {limit:5}, "start");

    res.json(pastTrivias.concat(upcommingTrivias));
}

async function calculateTickets(req, res) {
    const ctrl = new Ctrl();
    const ticketCtrl = new TicketCtrl();

    const trivia = await ctrl.getById(req.params.id);
    const userResults = await ctrl.getUserTrivia({trivia:req.params.id});
    console.log(userResults.length, trivia.payoutType);
    if( trivia.payoutType === 'perQuestion' ) {
        userResults.forEach((userResult) => {
            const rightQustions = userResult.questions.filter(x => x.correct);
            ticketCtrl.insert({
                amount:trivia.ticketsPerQuestions*rightQustions.length,
                user: userResult.user,
                reason: 'Trivia Game Correct Answers',
                ref: trivia._id,
                refType: 'triviaQuiz'
            });
        });
    } else {
        const winners = userResults.filter(x => x.questions[trivia.numOfQuestions-1].correct);
        console.log(winners.length);
        winners.forEach((winner) => {
            ticketCtrl.insert({
                amount:Math.floor(trivia.tickets/winners.length),
                user: winner.user,
                reason: 'Winning Trivia Game',
                ref: trivia._id,
                refType: 'triviaQuiz'
            });
        });
    }

    res.json();
}

async function insertUserTrivia(req, res) {
    const ctrl = new Ctrl();
    const userTrivia = await ctrl.insertUserTrivia(req.params.id, req.params.userId);
    res.json(userTrivia);
}

async function getUserTriviaById(req, res) {
    const ctrl = new Ctrl();
    const userTrivia = await ctrl.getUserTriviaById(req.params.id);
    res.json(userTrivia);
}

async function updateUserTrivia(req, res) {
    const ctrl = new Ctrl();

    const trivia = await ctrl.getById(req.body.trivia);
    if( trivia && trivia.questionAnswers && req.body.questions ) {
        req.body.questions.forEach((q, i) => {
            if( q.selectedOption === trivia.questionAnswers[i].answer )
                q.correct = true;
        });
    }

    const userTrivia = await ctrl.updateUserTrivia(req.params.id, req.body);
    res.json(userTrivia);
}

async function findUserTrivia(req, res) {
    const ctrl = new Ctrl();

    req.query.trivia = req.params.id;
    req.query.user = req.params.userId;

    const userTrivia = await ctrl.findUserTrivia(req.query);
    res.json(userTrivia);
}