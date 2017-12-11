var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer');
    cors = require('cors'),
    http = require("http"),
    router = express.Router(),
    XLSX = require('xlsx'),
    async= require('async'),
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
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json({limit:'50mb'}));
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}));
app.use(express.static(__dirname+'/client'));
app.use(express.static(__dirname));
app.use(expressSanitizer());
//app.use(cors());


   // logging
// var mkdirp = require('mkdirp');
//     mkdirp.sync('logs');
// var logger = require('./app/middleware/logger.js');
// app.use(require("morgan")("combined", { "stream": logger.stream }));

// APIs

app.get('/',function(req,res){
    res.sendFile(__dirname + "/client/index.html");
});

// Basic Authentication
//require('./app/middleware/baseAuth')(app,express);

 //Routes
app.use('/auth', require('./app/routes/auth')(sql,sqlconfig,jwt,config));

app.use('/spotcheck', require('./app/routes/spotcheck')(sql,sqlconfig,jwt,config));

app.use('/qmExcelDownload', require('./app/routes/qmExcelDownload')(sql,sqlconfig,jwt,config));

app.use('/qmExcelUpload',  require('./app/routes/qmExcelUpload')(sql,sqlconfig,jwt,config,async,XLSX));

// UNKNOWN ROUTES
// app.use('*',function(req, res) {
//     res.status(404).json({error:"requested url: "+req.baseUrl+ ' is not Found'});
// });


// UNCAUGHT EXCEPTIONS
process.on('uncaughtException', function(err) {
    console.log(err);
});

 // START THE SERVER
app.listen(config.port, function(){
    console.log('Server is running at ==> ' + applicationUrl);    
});

