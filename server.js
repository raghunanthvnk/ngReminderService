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
var transform= require('./app/routes/isvalidlogin.js')

//security 
app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", config.ClientApplicationUrl);
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

// Authenticate user withWindows Authentication and store username for all requests
global.domain; 
global.username;

app.use(function (req, res, next) {
    
        var nodeSSPI = require('node-sspi')
        var nodeSSPIObj = new nodeSSPI({
          retrieveGroups: true
        })
        nodeSSPIObj.authenticate(req, res, function(err){
          res.finished || next()
        })
})
app.use(function(req, res, next) {
    global.domain=req.connection.user.split("\\")[0]
    global.username=req.connection.user.split("\\")[1]
    var out =
      'Hello ' +
      req.connection.user +
      '! Your sid is ' +
      req.connection.userSid +
      ' and you belong to following groups:<br/><ul>'
        if (req.connection.userGroups) {
        for (var i in req.connection.userGroups) {
            out += '<li>' + req.connection.userGroups[i] + '</li><br/>\n'
        }
        }
    out += '</ul>'
    next();
})

   // logging
// var mkdirp = require('mkdirp');
//     mkdirp.sync('logs');
// var logger = require('./app/middleware/logger.js');
// app.use(require("morgan")("combined", { "stream": logger.stream }));

// APIs

app.get('/',function(req,res){
    res.sendFile(__dirname + "/client/index.html");
});


 //Routes
app.use('/auth', require('./app/routes/auth')(sql,sqlconfig,jwt,config));

app.get('/testapi', function (req, res) {
    // connect to your database
   res.end("Test Works!");
  });

// Basic Authentication - Verify JSON Token for below routes
//require('./app/middleware/baseAuth')(app,express);

app.use('/spotcheck', require('./app/routes/spotcheck')(sql,sqlconfig,jwt,config));

app.use('/qmExcelDownload', require('./app/routes/qmExcelDownload')(sql,sqlconfig,jwt,config));

app.use('/qmExcelUpload',  require('./app/routes/qmExcelUpload')(sql,sqlconfig,jwt,config,async,XLSX));

app.use('/pir',  require('./app/routes/pir')(sql,sqlconfig,jwt,config));

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

