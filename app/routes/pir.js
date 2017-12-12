
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
                request.input('initiator_name', sql.NVarChar, req.body.pir_details.InitiatorName)
                request.input('initiator_date', sql.DateTime, new Date(req.body.pir_details.InitiatorDate))
                request.input('status', sql.VarChar, req.body.pir_details.Status)
                request.input('email_address', sql.NVarChar, req.body.pir_details.EMAIL_ADDRESS)
                request.input('proposed_details', sql.NVarChar, req.body.pir_details.ProposedChangedetails)
                request.input('reason', sql.NVarChar, req.body.pir_details.ReasonForChange)
                request.input('remarks', sql.NVarChar, req.body.pir_details.Remarks)
                request.input('attachment_id', sql.NVarChar,req.body.pir_details.password)
                // request.output('response_pir_guid',sql.Int)
                // query to the database and get the records
                request.execute("PIR.RequestDetails_Save").then(function(recordSet) {
                    if (recordSet == null || recordSet.recordsets[0].length=== 0 || recordSet === undefined )
                      {
                       console.log('Not Exists!');
                       return;
                      }
                    else
                      {
                       
                        data=recordSet.recordsets;
                        res.send(JSON.stringify(data));
                        console.log(JSON.stringify(data));
                      }
                    sql.close();
                  }).catch(function (err) {         
                    console.log(err);
                    sql.close();
                });
            });
        });
        return router;
    }