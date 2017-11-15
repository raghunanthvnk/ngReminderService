var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer');
    cors = require('cors'),
    http = require("http"),
    router = express.Router(),
    XLSX = require('xlsx'),
    async= require('async'),
    multer  = require('multer'),
    fs = require('fs'),
    upload = multer({ dest: 'upload/'}),
    config = require('./config/config.js');
var applicationUrl = 'http://' + config.domain + ':' + config.port;
var psalt = "fdsflsdanhgslkbdkslgnksl";
var Cryptr = require('cryptr'),
    cryptr = new Cryptr(psalt);

var sql = require('mssql');
var jwt    = require('jsonwebtoken');

var sqlconfig = {
    connectionLimit : 100,
    multipleStatements:true,
    waitForConnections:true,
    server: config.host,
    database: config.database,
    user: config.user,
    password:  config.password,
};

//security 
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, x-access-token, Content-Type, Authorization');
    res.setTimeout(3600000,function(){
        res.status(408).json({success:false, message:"Request has timed out."})
    })
    next();
});


app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(express.static(__dirname+'/client'));
app.use(express.static(__dirname));
app.use(expressSanitizer());
app.use(cors());


// logging
// var mkdirp = require('mkdirp');
//     mkdirp.sync('logs');
// var logger = require('./app/middleware/logger.js');
// app.use(require("morgan")("combined", { "stream": logger.stream }));

// APIs

app.get('/',function(req,res){
    res.sendFile(__dirname + "/client/index.html");
});

app.use('/auth', require('./app/routes/auth')(sql,sqlconfig,jwt,config));


// Basic Authentication
//require('./app/middleware/baseAuth')(app,express);


//Routes
//app.use('/item', require('./app/routes/item')(express,pool));



// UNCAUGHT EXCEPTIONS
process.on('uncaughtException', function(err) {
    console.log(err);
});

// UNKNOWN ROUTES
app.use('*',function(req, res) {
    res.status(404).json({error:"requested url: "+req.baseUrl+ ' is not Found'});
});

 // START THE SERVER
// app.listen(config.port, function(){
//     console.log('Server is running at ==> ' + applicationUrl);    
// });

var server = app.listen(5000, function (req,res) {
        console.log('Server is running at port 5000..');
    });
    
    
    