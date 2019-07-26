const Schedule = require('node-schedule');

let rule = new Schedule.RecurrenceRule();

rule.minute = 59;

module.exports = {
    config: rule,
    // config: '48 * * * *',
    execute: function() {
        console.log('hello, world'); 
    }
}

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