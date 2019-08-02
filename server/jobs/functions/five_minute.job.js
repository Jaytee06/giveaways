const Schedule = require('node-schedule');
const mongoose = require('../../config/mongoose'); // setup database connections
const config = require('../../config/config');

const EmailCtrl= require('../../controllers/email.controller');

let rule = new Schedule.RecurrenceRule();

rule.minute = new Schedule.Range(0, 59, 5);

module.exports = {
    config: rule,
    execute: async function() {

    	if( config.env !== 'production' ) return; // this should only run on production servers

		const emailCtlr = new EmailCtrl();
		emailCtlr.emailQuizStarting();
    }
};

/*

DOCS: https://github.com/node-schedule/node-schedule

RecurrenceRule properties
second (0-59)
minute (0-59)
hour (0-23)
date (1-31)
month (0-11)
year
dayOfWeek (0-6) Starting with Sunday

*/