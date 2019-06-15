'use strict';
const Model = require('../models/trivia.model');
const request = require('request');
const _ = require('lodash');
const mongoose = require('mongoose');
const moment = require('moment');

class TriviaController {

    constructor() {}

    async insert(trivia) {

        const d = await this.generateQuestions(false, trivia);
        trivia.questions = d.questions;
        trivia.questionAnswers = d.answers;

        return await new Model(trivia).save();
    }

    async get(query) {
        return await Model.find().populate('user');
    }

    async getById(id) {
        return await Model.findById(id);
    }

    async update(id, trivia) {
        return await Model.findByIdAndUpdate(id, trivia, {new: true});
    }

    async remove(id) {
        return await Model.findByIdAndRemove(id);
    }

    async generateQuestions(id=false, quiz=false) {
        if( id && !quiz )
            quiz = await Model.findById(id);

        let url = 'https://opentdb.com/api.php?';
        if( quiz.numOfQuestions ) {
            url += "amount="+quiz.numOfQuestions;
        } else {
            url += "amount=10";
        }
        if( quiz.category != "any" ) url += "&category="+quiz.category;
        if( quiz.difficulty != "any" ) url += "&difficulty="+quiz.difficulty;
        if( quiz.questionType != "any" ) url += "&type="+quiz.questionType;

        return new Promise((resolve, reject) => {

            if( moment().isAfter(moment(quiz.start)) ) {
                return reject(new Error("Can't re generate questions after the quiz has happened."));
            }

            const req = request(url, { json: true }, (err, res, body) => {
                if (err) {
                    console.log(err);
                    return reject(new Error(err));
                }

                const data = {questions: [], answers: []}
                body.results.forEach((q) => {
                    const nId = mongoose.Types.ObjectId();
                    const options = q.incorrect_answers;
                    options.push(q.correct_answer);

                    data.questions.push({
                        _id: nId,
                        category: q.category,
                        type: q.type,
                        difficulty:q.difficulty,
                        question:q.question,
                        options:_.shuffle(options)
                    });

                    data.answers.push({
                        question:nId,
                        answer:q.correct_answer
                    });
                });
                resolve(data);
            });
            req.on('error', function(err) {
                reject(err);
            });
            req.end();
        })
    }
}

module.exports = TriviaController;