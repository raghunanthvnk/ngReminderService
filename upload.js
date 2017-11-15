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

//npm install multer  // for uplaod 
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'upload/'});

//npm install node-xlsx  // for parsing xlsx 
// var xlsx = require('node-xlsx');

var XLSX = require('xlsx');

var data;
var config = {
    server: 'fh-mmsts01',
    database: 'reminder_tool',
    user: 'mmsdev.ts',
    password: 'springweb123!'
};


app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});


app.get('/upload/get', function (req, res) {
    // connect to your database
    res.send("upload route");
    console.log("upload route");
     
  });