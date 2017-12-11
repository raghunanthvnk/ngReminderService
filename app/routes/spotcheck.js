
module.exports = function(sql,sqlconfig,jwt,config) {
    
        var router = require('express').Router();
         
        router.get('/serviceline_dtl', function (req, res) {
            console.log('IN');
            // connect to your database
            sql.close();
            sql.connect(sqlconfig, function (err) {
              
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
          
          router.get('/project_codes_dtl', function (req, res) {
            var ServiceLine = req.param('ServiceLine');
            sql.close();
            sql.connect(sqlconfig, function (err) {
              
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

            router.get('/ActivityNames_Get', function (req, res) {
                // connect to your database
                sql.close();
                sql.connect(sqlconfig, function (err) {
                
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

            router.get('/SUBACTIVITY_GET', function (req, res) {
                var ActivityName = req.param('ActivityName');
                var projectCode = req.param('Project_code');
                
              
                // connect to your database
                sql.close();
                sql.connect(sqlconfig, function (err) {
                  
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

              router.get('/SpotCheckDetailsforProject_GET', function (req, res) {
                var ActivityId = req.param('ActivityId');
              
                // connect to your database
                sql.close();
                sql.connect(sqlconfig, function (err) {
                  
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

              router.post('/UpdateSpotCheckDetails',function(req,res){
                
                
            
                var mode = req.param('mode');
                var ProjectCode = req.param('ProjectCode');
                var body_data=req.body;
            
               
               
                console.log(new Date(body_data.spot_check_details.EXPECTED_CLOSURE_DATE))
                   
                console.log(new Date(body_data.spot_check_details.ACTUAL_CLOSURE_DATE))
            
                   // connect to your database
                   sql.close();
                   sql.connect(sqlconfig, function (err) {
                     
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
            
            

        return router;
    }