// install mssql and express js using npm to work this example
var express = require('express');
//npm -init   npm install -g body-parser // globally install  or npm install -- save body-parser
var bodyParser = require('body-parser');

//npm install express
var http = require("http");
var app = express();

var router = express.Router();

//npm install mssql
// npm install msnodesqlv8
var sql = require('mssql');

//npm install multer
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'upload/'});


// ref:: https://stackoverflow.com/questions/30859901/parse-xlsx-with-node-and-create-json/40292005#40292005
var XLSX = require('xlsx');

var async= require('async');

var nodemailer  = require('./nodemailer.js');


//var nodemailer  = require('./authenticate.js');


var data;
// var config = {
//     server: 'INBGMW-C037',
//     database: 'MinacsInvoiceReminders',
//     user: 'sa',
//     password: 'psi'
// };


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
    
    

    var mode = req.param('mode');
    var ProjectCode = req.param('ProjectCode');
    var body_data=req.body;

   
   
    console.log(new Date(body_data.spot_check_details.EXPECTED_CLOSURE_DATE))
       
    console.log(new Date(body_data.spot_check_details.ACTUAL_CLOSURE_DATE))

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


                                      /** Upload code */

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.originalname);
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
        // read data from a file and send response
        var workbook = XLSX.readFile('./uploads/'+req.file.originalname);
        var sheet_name_list = workbook.SheetNames;
        var data= XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        res.send(data);
        //  res.json({error_code:0,err_desc:null});
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

  
app.get('/api/upload/getProjectMaster', function (req, res) {
    // connect to your database

    var Flag = req.param('Flag');
    var project_code = req.param('project_code');

    sql.close();
    sql.connect(config, function (err) {
      
          if (err) console.log(err);
          // create Request object
          var request = new sql.Request();
          request.input('p_Flag', sql.VarChar, Flag)
          request.input('p_ProjectCode', sql.VarChar, project_code)
          request.input('p_TimeStamp', sql.Int,0)
          
          request.output('po_Retval',sql.Int)
          request.output('po_UpdatedBy',sql.VarChar)
          request.output('po_UpdatedTime',sql.DateTime)
          request.output('po_Message',sql.VarChar)
          // query to the database and get the records
          request.execute("[dbo].[ARA_SP_DS_GetProjectMaster]").then(function(recordSet) {
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

  app.post('/api/upload/UpdateQualityExcel',function(req,res){
  
     UpdateQualityExcel_Flag = req.param('Flag');
    
     body_data=req.body;
     
     UpdateQualityExcel_res_data=[];
     
     var j=1;
     sql.close();
     sql.connect(config, function (err) {
    
    
     if (err) console.log(err);

       
        // for(i=0;i<body_data.EXCEL_ROWS.length;i++)
        // {
                        
        //     Postdata(UpdateQualityExcel_Flag, body_data.EXCEL_ROWS[i],i, function(id) {
        //         console.log(id);
        //         j++;    
        //     }); 

        // }
        var i=0;
       
        async.forEachOf(body_data.EXCEL_ROWS, function (EXCEL_ROWS, i, callback) {
            // varBody.index = i;
            // varBody.memberID = result.program_member.id;
            // request(
            // Postdata1(UpdateQualityExcel_Flag, body_data.EXCEL_ROWS[i],i)
            // , function () {
            //     // Do more Stuff
            //     // The next iteration WON'T START until callback is called
            //     callback();
            // });
            Postdata(UpdateQualityExcel_Flag, EXCEL_ROWS,i, function(id) {
                console.log(id);
                i++;
                callback();
            }); 
        }, function () {
            // We're done looping in this function!
            console.log(UpdateQualityExcel_res_data);

            nodemailer.createTestAccount();            
            res.send(UpdateQualityExcel_res_data);
        });



    })
 
  
});

function Postdata(UpdateQualityExcel_Flag, EXCEL_ROWS,i, cb) {

    // sql.close();
    // sql.connect(config, function (err) {
      
    //     if (err) console.log(err);
          //create Request object
        var request = new sql.Request();

        request.input('p_Flag', sql.VarChar, UpdateQualityExcel_Flag)
        request.input('p_ProjectCode', sql.NVarChar, EXCEL_ROWS.PROJECT_CODE);
        request.input('p_ActivityId',sql.INT,EXCEL_ROWS.ACTIVITY_ID);
        request.input('p_ActivityName', sql.VarChar, EXCEL_ROWS.ACTIVITY_NAME);
        request.input('p_ModuleName', sql.VarChar, EXCEL_ROWS.MODULE_NAME);
        request.input('p_MitsEmailId',sql.VarChar,EXCEL_ROWS.MITS_QUALITY_EMAIL_ID);
        request.input('p_RespName', sql.NVarChar, EXCEL_ROWS.RESPONSIBLE)
        request.input('p_RespEmailId',sql.VarChar,EXCEL_ROWS.RESPONSIBLE_PERSON_EMAIL_ID);
        request.input('p_RespNtid',sql.VarChar,EXCEL_ROWS.RESPONSIBLE_PERSON_NTID);
        request.input('p_ExpectedDate', sql.DateTime ,new Date(EXCEL_ROWS.EXPECTED_CLOSURE_DATE));
        request.input('p_ActualDate', sql.DateTime, null //new Date(body_data.EXCEL_ROWS[i].ACTUAL_CLOSURE_DATE)
        );
        request.input('p_ReminderActive', sql.Int,EXCEL_ROWS.REMINDER_ACTIVE)
        request.input('p_Status',sql.VarChar,EXCEL_ROWS.STATUS);
        request.input('p_Comments',sql.VarChar,EXCEL_ROWS.COMMENTS);
        request.input('p_PassFail',sql.VarChar,EXCEL_ROWS.PASSFAIL);
        request.input('p_Theme', sql.NVarChar, EXCEL_ROWS.THEME);
    
        request.output('po_Retval',sql.Int)
        request.input('p_TimeStamp', sql.Int, 0);
        request.output('po_UpdatedBy',sql.VarChar)
        request.output('po_UpdatedTime',sql.DateTime)
        request.output('po_Message',sql.VarChar)
        request.output('po_ActivityClosed',sql.INT)
        // query to the database and get the records
        request.execute("[dbo].[ARA_SP_ACTION_QualityExcelUpdate]").then(function(recordSet) {
            
           
            EXCEL_ROWS.DATABASE_MESSAGE=request.parameters.po_Message.value;
            EXCEL_ROWS.SC_ACTIVITY_CLOSED_TODAY=request.parameters.po_ActivityClosed.value;
           
            UpdateQualityExcel_res_data.push(EXCEL_ROWS)

            if (recordSet == null || recordSet.length === 0)
                return;
            // res.send(recordset);
            // sql.close();
            // console.log(request.parameters.po_Message)
            cb(i);
           
        }).catch(function (err) {         
            console.log(err);
            
        });
    // });
}


                             //Authentication

app.post('/api/authenticate', function (req, res) {

      // connect to your database

      console.log(req);

      sql.close();
      sql.connect(config, function (err) {
        
            if (err) console.log(err);
            console.log(req.body.username);
            // create Request object
            var request = new sql.Request();
            request.input('UserName', sql.VarChar, req.body.username)
            request.input('Password', sql.VarChar, req.body.password)
            
            // query to the database and get the records
            request.execute("[admin].[check_user]").then(function(recordSet) {
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

var server = app.listen(5000, function (req,res) {

   
   
    console.log('Server is running at port 5000..');
});


