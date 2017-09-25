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
var upload = multer({ dest: 'upload/'});

   

var transform= require('./RemindersDataService.js')


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



app.get('/serviceline_dtl', function (req, res) {
  // connect to your database
  sql.close();
  sql.connect(config, function (err) {
    
        if (err) console.log(err);
        // create Request object
        var request = new sql.Request();
        request.input('p_Flag', sql.VarChar, "ALL_SERVICE_LINE")
        request.output('po_Retval',sql.Int)
        request.output('po_UpdatedBy',sql.VarChar)
        request.output('po_UpdatedTime',sql.DateTime)
        request.output('po_Message',sql.VarChar)
        // query to the database and get the records
        request.execute("[dbo].[ARA_SP_DS_GetAllSLDetails]").then(function(recordSet) {
            if (recordSet == null || recordSet.length === 0)
                return;
           
           // res.send(recordset);
            data=recordSet.recordsets;
            res.send(JSON.stringify(data));
            console.log(data);
            sql.close();
        }).catch(function (err) {         
            console.log(err);
            sql.close();
        });
    });
   
});


app.get('/project_codes_dtl', function (req, res) {
    var ServiceLine = req.param('ServiceLine');
    sql.close();
    sql.connect(config, function (err) {
      
          if (err) console.log(err);
          // create Request object
          var request = new sql.Request();
          request.input('p_Flag', sql.VarChar, "ALL_PROJECT_MASTER")
          request.input('P_ServiceLine', sql.VarChar, ServiceLine)
          request.input('P_ProjectCode', sql.VarChar, "dummy")
          request.output('po_Retval',sql.Int)
          request.output('po_UpdatedBy',sql.VarChar)
          request.output('po_UpdatedTime',sql.DateTime)
          request.output('po_Message',sql.VarChar)
          // query to the database and get the records
          request.execute("[dbo].[ARA_SP_DS_GetAllProjectMasterDetails]").then(function(recordSet) {
              if (recordSet == null || recordSet.length === 0)
                  return;
              console.log(recordSet.recordsets);
             // res.send(recordset);
              data=recordSet.recordsets;
              res.send(JSON.stringify(data));
              sql.close();
          }).catch(function (err) {         
              console.log(err);
              sql.close();
          });
      });
});

//http://localhost:5000/ActivityNames_Get
app.get('/ActivityNames_Get', function (req, res) {
    // connect to your database
    sql.close();
    sql.connect(config, function (err) {
      
          if (err) console.log(err);
          // create Request object
          var request = new sql.Request();
          request.input('p_ModuleName', sql.VarChar, "Spot Check Status")
          request.input('p_Mode', sql.NVarChar, "dummy")
          request.input('p_Flag', sql.NVarChar, "dummy")
          request.input('p_TimeStamp', sql.Int, 0)
          request.output('po_Retval',sql.Int)
          request.output('po_UpdatedBy',sql.VarChar)
          request.output('po_UpdatedTime',sql.DateTime)
          request.output('po_Message',sql.VarChar)
          // query to the database and get the records
          request.execute("[dbo].[ARA_SP_DS_GetActivityTypes]").then(function(recordSet) {
              if (recordSet == null || recordSet.length === 0)
                  return;
             
             // res.send(recordset);
              data=recordSet.recordsets;
              res.send(JSON.stringify(data));
              console.log(data);
              sql.close();
          }).catch(function (err) {         
              console.log(err);
              sql.close();
          });
      });
     
  });
  
  app.get('/SUBACTIVITY_GET', function (req, res) {
    var ActivityName = req.param('ActivityName');
    var projectCode = req.param('Project_code');
    
  
    // connect to your database
    sql.close();
    sql.connect(config, function (err) {
      
          if (err) console.log(err);
          // create Request object
          var request = new sql.Request();
          request.input('p_Flag', sql.VarChar, "GET_SUBACTIVITY_FOR_PROJECT")
          request.input('p_ProjectCode', sql.NVarChar, projectCode)
          request.input('p_ActivityName', sql.NVarChar, ActivityName)
         // request.input('p_ExpectedDate', sql.DateTime,"09-09-1989")
          request.input('p_ActivityID',sql.VarChar,"dummy");
          request.output('po_Retval',sql.Int)
          request.output('po_UpdatedBy',sql.VarChar)
          request.output('po_UpdatedTime',sql.DateTime)
          request.output('po_Message',sql.VarChar)
          // query to the database and get the records
          request.execute("[dbo].[ARA_SP_DS_GetAllSpotCheckDetailsForAProject1]").then(function(recordSet) {
              if (recordSet == null || recordSet.length === 0)
                  return;
             
             // res.send(recordset);
              data=recordSet.recordsets;
              res.send(JSON.stringify(data));
              console.log(data);
              sql.close();
          }).catch(function (err) {         
              console.log(err);
              sql.close();
          });
      });
     
  });

  app.get('/SpotCheckDetailsforProject_GET', function (req, res) {
    var ActivityId = req.param('ActivityId');
  
    // connect to your database
    sql.close();
    sql.connect(config, function (err) {
      
          if (err) console.log(err);
          // create Request object
          var request = new sql.Request();
          request.input('p_Flag', sql.VarChar, "GET_SC_DETAILS_FOR_PROJECT")
          request.input('p_ProjectCode', sql.NVarChar, "dummy");
          request.input('p_ActivityName', sql.NVarChar, "dummy")
        //  request.input('p_ExpectedDate', sql.DateTime,"09-09-2018")
          request.input('p_ActivityID',sql.VarChar,ActivityId);
          request.output('po_Retval',sql.Int)
          request.output('po_UpdatedBy',sql.VarChar)
          request.output('po_UpdatedTime',sql.DateTime)
          request.output('po_Message',sql.VarChar)
          // query to the database and get the records
          request.execute("[dbo].[ARA_SP_DS_GetAllSpotCheckDetailsForAProject1]").then(function(recordSet) {
              if (recordSet == null || recordSet.length === 0)
                  return;
             
             // res.send(recordset);
              data=recordSet.recordsets;
              res.send(JSON.stringify(data));
              console.log(data);
              sql.close();
          }).catch(function (err) {         
              console.log(err);
              sql.close();
          });
      });
     
  });
  
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());
  app.post('/api/UpdateSpotCheckDetails',function(req,res){
    console.log(req.body);
    

    var mode = req.param('mode');
    var ProjectCode = req.param('ProjectCode');
    var body_data=req.body;

    console.log(body_data.activity);
    console.log(body_data.spot_check_details);
    console.log(body_data.activity[0].ACTIVITY_NAME);
    console.log(body_data.activity[0].PARENT_ACTIVITY_ID);
       // connect to your database
       sql.close();
       sql.connect(config, function (err) {
         
             if (err) console.log(err);
             // create Request object
             
             var request = new sql.Request();
             request.input('p_mode', sql.VarChar, mode)
             request.input('p_ModuleName', sql.VarChar, "Spot Check Status");
             request.input('p_ActivityName', sql.VarChar, body_data.activity[0].ACTIVITY_NAME);
             request.input('p_ActivityID',sql.VarChar,body_data.spot_check_details.ACTIVITY_ID);
             request.input('p_Responsible', sql.NVarChar, body_data.spot_check_details.RESPONSIBLE)
             request.input('p_ResponsibleEmailId',sql.VarChar,body_data.spot_check_details.RESPONSIBLE_PERSON_EMAIL_ID);
             request.input('p_MitsEmailId',sql.VarChar, body_data.spot_check_details.MITS_QUALITY_EMAIL_ID);
             request.input('p_ExpectedDate', sql.DateTime ,new Date(body_data.spot_check_details.EXPECTED_CLOSURE_DATE));
             request.input('p_Ntid',sql.VarChar,body_data.spot_check_details.NTID);
             request.input('p_Status',sql.VarChar,body_data.spot_check_details.STATUS);
             request.input('p_PassFail',sql.VarChar,body_data.spot_check_details.PASSFAIL);
             request.input('p_Comments',sql.VarChar,body_data.spot_check_details.COMMENTS);
             request.input('p_ProjectCode', sql.NVarChar, ProjectCode);
             request.input('p_Theme', sql.NVarChar, body_data.spot_check_details.THEME);
             request.input('p_ActualDate', sql.DateTime, new Date(body_data.spot_check_details.ACTUAL_CLOSURE_DATE));
             request.input('p_ReminderActive', sql.Int,body_data.spot_check_details.REMINDER_ACTIVE)
             request.input('p_UserName', sql.VarChar,body_data.spot_check_details.NTID)
             request.input('p_TimeStamp', sql.Int, 0);
          
             
             request.output('po_Retval',sql.Int)
             request.output('po_UpdatedBy',sql.VarChar)
             request.output('po_UpdatedTime',sql.DateTime)
             request.output('po_Message',sql.VarChar)
             // query to the database and get the records
             request.execute("[dbo].[ARA_SP_ACTION_MinacsSpotCheckDetailsUpd]").then(function(recordSet) {
                 if (recordSet == null || recordSet.length === 0)
                     return;
                
                // res.send(recordset);
                 data=recordSet.recordsets;
                 res.send(JSON.stringify(data));
                 console.log(data);
                 sql.close();
             }).catch(function (err) {         
                 console.log(err);
                 sql.close();
             });
         });

});
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    }
});

var upload = multer({ //multer settings
                storage: storage
            }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
    upload(req,res,function(err){
        console.log(req.file);
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }
         res.json({error_code:0,err_desc:null});
    });
});

app.get('/api/RemindersData', function (req, res) {
    // connect to your database

    var Flag = req.param('Flag');

    sql.close();
    sql.connect(config, function (err) {
      
          if (err) console.log(err);
          // create Request object
          var request = new sql.Request();
          request.input('p_Flag', sql.VarChar, Flag)
          request.output('po_Retval',sql.Int)
          request.output('po_UpdatedBy',sql.VarChar)
          request.output('po_UpdatedTime',sql.DateTime)
          request.output('po_Message',sql.VarChar)
          // query to the database and get the records
          request.execute("[dbo].[ARA_SP_DS_GetAllQualityRemindersData]").then(function(recordSet) {
              if (recordSet == null || recordSet.length === 0)
                  return;
             
             // res.send(recordset);
              data=recordSet.recordsets;
              res.send(JSON.stringify(data));
              console.log(data);
              sql.close();
          }).catch(function (err) {         
              console.log(err);
              sql.close();
          });
      });
     
  });

var server = app.listen(5000, function () {
    console.log('Server is running..');
});


