var nodemailer  = require('../../nodemailer.js')
module.exports = function(sql,sqlconfig,jwt,config) {
       
        var router = require('express').Router();
            // //Authentication
        router.post('/UpdatePIRDetails', function (req, res) {

            var pir_details=req.body.pir_details;
            var mode=req.body.mode;
            console.log(req.body);
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
                request.input('comments', sql.VarChar,req.body.pir_details.comments)
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
                        if(req.body.mode=='ADD')
                        {
                             // send confirmation mail to user
                            var contenthtml=
                                 '<html>'
                                +'<body style="background-color:#FFF">'
                                +'<div style="color:#3c763d;;border-color:#d639c6;border-radius: 4px;border: 1px solid transparent;">' 
                                +'<p>Hi Name,</p>'
                                +'<p>Thank You For submitting PIR Request, we value your feedback.</p>'
                                +'<p>Please visit '+config.ClientApplicationUrl+'/userdashboard/USERLayout/PIR to update the details with below ticket number.</p>'
                                +'<p">PIR NO: RID </p>'
                                +'<br />'
                                +'<span >Thank you,</span>'
                                +'<br />'
                                +'<div><span>SEPG Team.</span></div>'
                                +'<br />'
                                +'<P>** This is an auto generated e-mail. Please do not reply.</P>'
                                +'</div>'
                                +'</body>'
                                +'</html>'
                            contenthtml= contenthtml.replace(/Name/g,req.body.pir_details.initiator_name)
                            contenthtml= contenthtml.replace(/RID/g,data[0][0].pir_guid)
                            nodemailer.SMTPMailSender(contenthtml,req.body.pir_details.email_address);
                           
                          
                              // send notification mail to SEPG team
                              var contenthtml=
                              '<html>'
                             +'<body style="background-color:#FFF">'
                             +'<div style="color:#3c763d;;border-color:#d639c6;border-radius: 4px;border: 1px solid transparent;">' 
                             +'<p>Hi Team,</p>'
                             +'<p>Name has submitted new PIR Request,</p>'
                             +'<p>Please visit '+config.ClientApplicationUrl+'/sepgdashboard/SEPGLayout/PIRModification to update the details with below ticket number.</p>'
                             +'<p">PIR NO: RID </p>'
                             +'<br />'
                             +'<span >Thank you,</span>'
                             +'<br />'
                             +'<div><span>SEPG Team.</span></div>'
                             +'<br />'
                             +'<P>** This is an auto generated e-mail. Please do not reply.</P>'
                             +'</div>'
                             +'</body>'
                             +'</html>'
                              contenthtml= contenthtml.replace(/Name/g,req.body.pir_details.initiator_name)
                              contenthtml= contenthtml.replace(/RID/g,data[0][0].pir_guid)
                              nodemailer.SMTPMailSender(contenthtml,config.SEPG_Mail_ID);

                              res.send(JSON.stringify(data[0][0]));
                        }
                        else{
                        res.send(JSON.stringify(data));
                        }
                      
                      }
                    sql.close();
                  }).catch(function (err) {         
                    console.log(err);
                    sql.close();
                });
            });
        });

        
        router.get('/GET_PIR_RECORDS_FORDT', function (req, res) {
         
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
                request.execute("PIR.GET_PIR_RECORDS_FORDT").then(function(recordSet) {
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

        router.get('/GetAllPIRHistory', function (req, res) {
            
               // connect to your database
               sql.close();
               sql.connect(sqlconfig, function (err) {
                   if (err) console.log(err);
                   // create Request object
                   var request = new sql.Request();
                   // query to the database and get the records
                   request.execute("PIR.GET_PIRAllHISTORY_RECORDS").then(function(recordSet) {
                       if (recordSet == null || recordSet.length === 0)
                           return;
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
                    res.send(JSON.stringify("Please Enter Correct ID"));     
                    console.log(err);
                    sql.close();
                });
            });
            
        });

        router.post('/SendEmail',function(req,res){
          nodemailer.SMTPMailSender();
        });

        return router;
    }