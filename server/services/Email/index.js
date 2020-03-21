'use strict'

const nodemailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");
const config = require('../../config/config');

// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//     host: 'smtp.ethereal.email',
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: '', // generated ethereal user
//         pass: account.pass // generated ethereal password
//     }
// });

const transporter = nodemailer.createTransport(smtpTransport(config.contactEmail));


module.exports = {

    /**
     * 
     * @param {string} from 
     * @param {string} to 
     * @param {string} subject 
     * @param {string} html 
     */
    send: function(from, to, subject, html) { 

        // setup email data with unicode symbols
        const mailOptions = {
            from,
            to,
            subject,
            html
        };

        return new Promise((resolve, reject) => {
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                }

                resolve(info);
            });
        });
    }
}
