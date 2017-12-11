
module.exports = function(sql,sqlconfig,jwt,config) {
    
        var router = require('express').Router();
       
        router.get('/RemindersData', function (req, res) {
            // connect to your database
        
            var Flag = req.param('Flag');
        
            sql.close();
            sql.connect(sqlconfig, function (err) {
              
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

        return router;
    }