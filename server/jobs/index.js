const schedule = require('node-schedule');
const fs = require('fs');

/**
 * In order to create a cron job, 
 * create a file in the functions directory.
 * See the example.job.js for reference.
 */

fs.readdir('./server/jobs/functions/', (err, jobs) => {
    jobs.forEach(job => {
        job = require(`./functions/${job}`);
        schedule.scheduleJob(job.config, job.execute);
    });
});
