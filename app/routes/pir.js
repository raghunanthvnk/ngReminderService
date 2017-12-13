
module.exports = function(sql,sqlconfig,jwt,config) {
    
    
        var router = require('express').Router();
    
        // //Authentication
        router.post('/UpdatePIRDetails', function (req, res) {

            var pir_details=req.body.pir_details;
            var mode=req.body.mode;
            
            // connect to your database
            sql.close();
            sql.connect(sqlconfig, function (err) {
                if (err) console.log(err);
                // create Request object
                var request = new sql.Request();
                request.input('initiator_name', sql.NVarChar, req.body.pir_details.initiator_name)
                request.input('initiator_date', sql.DateTime, new Date(req.body.pir_details.initiator_date))
                request.input('status', sql.VarChar, req.body.pir_details.status)
                request.input('email_address', sql.NVarChar, req.body.pir_details.email_address)
                request.input('proposed_details', sql.NVarChar, req.body.pir_details.proposed_details)
                request.input('reason', sql.NVarChar, req.body.pir_details.reason)
                request.input('remarks', sql.NVarChar, req.body.pir_details.remarks)
                request.input('attachment_id', sql.NVarChar,req.body.pir_details.attachment_id)
                request.input('pir_id', sql.Int,req.body.pir_details.pir_id)
                request.input('mode', sql.VarChar,req.body.mode)
                // request.output('response_pir_guid',sql.Int)
                // query to the database and get the records
                request.execute("PIR.RequestDetails_Save").then(function(recordSet) {
                    if (recordSet == null  || recordSet === undefined )
                      {
                       console.log('Not Exists!');
                       return;
                      }
                    else
                      {
                        data=recordSet.recordsets;
                        res.send("Record Updated Successfully");
                      }
                    sql.close();
                  }).catch(function (err) {         
                    console.log(err);
                    sql.close();
                });
            });
        });

        
        router.get('/GetAllPIRHistory', function (req, res) {
         
            // connect to your database
            sql.close();
            sql.connect(sqlconfig, function (err) {

                if (err) console.log(err);
                // create Request object
                var request = new sql.Request();
        
                request.input('STARTROWINDEX', sql.Int,req.param('pagesIndex'))
                request.input('MAXIMUMROWS', sql.Int,req.param('pageSize'))
                request.input('GETTOTAL', sql.Bit,1)
                request.output('TOTALRECORDS',sql.Int)
              
                // query to the database and get the records
                request.execute("PIR.GET_PIRAllHISTORY_RECORDS").then(function(recordSet) {
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

        router.get('/GetPIRHistorybyID', function (req, res) {
          console.log(req.param('pir_guid'))
            // connect to your database
            sql.close();
            sql.connect(sqlconfig, function (err) {

                if (err) console.log(err);
                // create Request object
                var request = new sql.Request();
        
                request.input('pir_guid', sql.UniqueIdentifier,req.param('pir_guid'))
              
                // query to the database and get the records
                request.execute("PIR.GetPIRHistorybyID").then(function(recordSet) {
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