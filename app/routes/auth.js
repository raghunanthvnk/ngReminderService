
module.exports = function(sql,sqlconfig,jwt,config) {


    var router = require('express').Router();

    // //Authentication
    router.post('/authenticate', function (req, res) {
        // connect to your database
        sql.close();
        sql.connect(sqlconfig, function (err) {
            if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            request.input('UserName', sql.VarChar, req.body.username)
            request.input('Password', sql.VarChar, req.body.password)
            // query to the database and get the records
            request.execute("[admin].[check_user]").then(function(recordSet) {
                if (recordSet == null || recordSet.recordsets[0].length=== 0 || recordSet === undefined )
                  {
                   console.log('Not Exists!');
                   return;
                  }
                else
                 {
                    data=recordSet.recordsets;
                    const payload = {
                        user: data 
                    };
                    var token = jwt.sign(payload, config.secret, {
                        expiresIn: 1440 // expires in 24 hours
                    });
                    // return the information including token as JSON
                    res.json({
                    success: true,
                    message: JSON.stringify(data),
                    token: token
                    });
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