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


var data;
var config = {
    server: 'INBGMW-C037',
    database: 'MinacsInvoiceReminders',
    user: 'sa',
    password: 'psi'
};
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


