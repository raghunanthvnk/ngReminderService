var express = require('express'),
app = express(),
http = require("http"),
router = express.Router(),
async= require('async'),
config = require('../../config/config.js');
var applicationUrl = 'http://' + config.domain + ':' + config.port;
var psalt = "fdsflsdanhgslkbdkslgnksl";

var sql = require('mssql');

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
res.header("Access-Control-Allow-Origin", config.ClientApplicationUrl);
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
res.header("Access-Control-Allow-Credentials", true);
next();
});

exports.isvalidlogin= function(){
    // var str =username;

    // var request=str.split("\");
    
    sql.close();
    sql.connect(sqlconfig, function (err) {
    if (err) console.log(err);
        // create Request object
        console.log(username)
        var request = new sql.Request();
        request.input('p_Flag', sql.VarChar, "INVOICE_REMINDERS_USERS")
        request.input('p_UserName', sql.NVarChar, username);
        request.output('po_Retval',sql.Int)
        request.output('po_UpdatedBy',sql.VarChar)
        request.output('po_UpdatedTime',sql.DateTime)
        request.output('po_Message',sql.VarChar)
        // query to the database and get the records
        request.execute("[dbo].[ARA_SP_DS_GetApplicationUsers]").then(function(recordSet) {
            if (recordSet == null || recordSet.length === 0)
                return;
            
            // res.send(recordset);
            data=recordSet.recordsets[1][0];
            if (username === data.MX_LOGIN_ID) {
                sql.close();
              // res.send(data.MX_LOGIN_ID)
                return data.MX_LOGIN_ID
             }
             else{
             res.status(401).send({
                 message: 'Access denied'
             });
            }
            sql.close();
           
        }).catch(function (err) {         
            console.log(err);
            sql.close();
        });
    });
}