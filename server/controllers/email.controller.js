'use strict';
const config = require('../config/config');
const TriviaCtrl= require('./trivia.controller');
const UserCtrl= require('./user.controller');
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const moment = require('moment');

class EmailController {

    constructor() {}

    async emailQuizStarting() {
        const triviaCtrl = new TriviaCtrl();

        // see if trivia games are starting
        const dateRange = {$gte:moment().add(25, 'minutes').utc().format(), $lt:moment().add(30, 'minutes').utc().format()};
        const trivias = await triviaCtrl.get({start:dateRange});

        const emailer = nodemailer.createTransport(smtpTransport(config.contactEmail));
        const promise = trivias.map(async(trivia) => {
            let html = `<h2>Trivia Quiz Starting in ${moment(trivia.start).fromNow()}</h2>
			<p><a href="https://www.vintley.com/trivia-quiz/${trivia._id}">Come play the quiz and earn tickets!</a></p>
			<h4>Trivia Quiz Rules:</h4>
			<p>`;
            if ( trivia.payoutType == 'perQuestion' ) {
                html += `<span>For this trivia game you will earn ${trivia.ticketsPerQuestions} tickets per question you answer correctly. There are ${trivia.numOfQuestions} questions so you have a possibility of earning ${trivia.ticketsPerQuestions*trivia.numOfQuestions} tickets!</span>`;
            } else {
                html += `For this trivia game there are ${trivia.tickets} tickets being awarded to the winners. You are a winner if you answer all questions correctly. If you get 1 question wrong you are disqualified. The ${trivia.tickets} tickets are divided among the winners, so if there are 10 winners they will each win ${trivia.tickets/10} tickets!`;
            }
            html += `</p>
			<p>
				You will have ${trivia.questionDuration} seconds to answer each question.`;
            if( trivia.questionType === 'any' )
                html += `<span">All questions will either be multiple choice or true / false.</span>`;
            else if( trivia.questionType === 'multiple' )
                html += `<span>All questions will be multiple choice.</span>`;
            else if( trivia.questionType === 'boolean' )
                html += `<span>All questions will be true / false.</span>`;
            html += `</p>
			<p>
				You will have to be subscribed to <a href="https://www.twitch.tv/vintleytv">VintleyTV</a> on twitch to be able to enter this trivia quiz.
			</p>
			<p>
				There are ${trivia.numOfQuestions} questions in this quiz.
			</p>`;

            // see if if users are joined on this trivia.
            const users = await triviaCtrl.getUserTrivia({trivia:trivia._id, receiveNotifications:true});
            users.forEach((user) => {

                html += `<div style="text-align: center"><a href="https://www.vintley.com/session/unsubscribe/${user.emailToken}">Unsubscribe</a></div>`;

                const mailOptions = {
                    to: user.user.twitch.email,
                    from: 'contact@vintley.com',
                    subject: 'Trivia quiz starting in '+moment(trivia.start).fromNow(),
                    html: html,
                    attachments: [],
                };

                emailer.sendMail(mailOptions, async (err) => {
                    console.log('Email sent', err);
                });
            });
        });
        await Promise.all(promise);
    }

    async emailLoginBonus() {

        const query = {
            '$or': [
                {loginLogs:{$not:{$gte:new Date(moment().subtract(4, 'days').startOf('day').format())}}},
                {loginLogs:{$not:{$gte:new Date(moment().subtract(3, 'days').startOf('day').format())}}},
                {loginLogs:{$not:{$gte:new Date(moment().subtract(2, 'days').startOf('day').format())}}},
                {loginLogs:{$not:{$gte:new Date(moment().subtract(1, 'days').startOf('day').format())}}},
            ],
            receiveEmails: true,
        };

        let html = `<p><b>Did you know that you get a login ticket bonus for every day you log in to <a href="https://www.vintley.com">Vintley</a>?</b></p>`;

        const users = await UserCtrl.get(query);

        const emailer = nodemailer.createTransport(smtpTransport(config.contactEmail));
        const promises = users.map(async(user) => {

            if( !user.loginLogs || !user.loginLogs.length )
                html += `<p>${user.fullname} we have noticed you have not logged in at all!</p>`;
            else
                html += `<p>${user.fullname} we have noticed that your last login was ${moment(user.loginLogs[user.loginLogs.length-1]).fromNow()}!</p>`;

            html += `<p>That's some serious tickets you are missing out on!</p>`;
            html += `<p><a href="https://www.vintley.com">Log in</a> now to get your FREE tickets!</p>`;

            html += `<div style="text-align: center"><a href="https://www.vintley.com/session/unsubscribe/${user.emailToken}">Unsubscribe</a></div>`;

            const mailOptions = {
                to: user.twitch.email,
                from: 'contact@vintley.com',
                subject: 'Claim your daily login bonus',
                html: html,
                attachments: [],
            };

            emailer.sendMail(mailOptions, async (err) => {
                console.log('Email sent', err);
            });
        });
        await Promise.all(promises);
    }

}

module.exports = EmailController;