// install mssql and express js using npm to work this example
var express = require('express');
//npm -init   npm install -g body-parser // globally install  or npm install -- save body-parser
var bodyParser = require('body-parser');

//npm install express
var http = require("http");
var app = express();

var router = express.Router();

//npm install mssql
var sql = require('mssql');

//npm install multer
var multer  = require('multer');
var fs = require('fs');


// npm install nodemailer --save

'use strict';
const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
exports.SMTPMailSender= function(contenthtml,email_address ){
   // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtprelayfh.minacs.com',
        port: 25,
        secure: false // true for 465, false for other ports
        // auth: {
        //     user: account.user, // generated ethereal user
        //     pass: account.pass  // generated ethereal password
        // }
        ,tls: {
            rejectUnauthorized: false
        }
    });

    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: 'koppuravuri.raghu@gmail.com',
    //       pass: 'raghu456#'
    //     }
    //   });
    
   

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Concentrix" <no-reply@concentrix.com>', // sender address
        to: email_address, // list of receivers
        subject: 'Process Improvement Request', // Subject line
        text: 'Process Improvement Request', // plain text body
        html: contenthtml // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
};
