

var nodemailer  = require('../../nodemailer.js')
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'uploads/'});


module.exports = function(sql,sqlconfig,jwt,config,async,XLSX) {
    
        var router = require('express').Router();

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
        router.post('/upload', function(req, res) {
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

        router.post('/UpdateQualityExcel',function(req,res){
                UpdateQualityExcel_Flag = req.param('Flag');
                body_data=req.body;
                UpdateQualityExcel_res_data=[];
                var j=1;
                sql.close();
                sql.connect(sqlconfig, function (err) {
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

        router.get('/getProjectMaster', function (req, res) {
            // connect to your database
        
            var Flag = req.param('Flag');
            var project_code = req.param('project_code');
            sql.close();
            sql.connect(sqlconfig, function (err) {
              
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

        return router;
    }