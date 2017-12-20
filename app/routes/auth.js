
module.exports = function(sql,sqlconfig,jwt,config) {
    var router = require('express').Router();
    // Forms Authentication
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

    
   // Windows Authentication
    router.get('/Windowsauthenticate', function (req, res) {
        console.log(global.username + ' in Windowsauthenticate')
        // connect to your database
        sql.close();
        sql.connect(sqlconfig, function (err) {
        if (err) console.log(err);
            // create Request object
            var request = new sql.Request();
            request.input('p_Flag', sql.VarChar, "INVOICE_REMINDERS_USERS")
            request.input('p_UserName', sql.NVarChar, global.username);
            request.output('po_Retval',sql.Int)
            request.output('po_UpdatedBy',sql.VarChar)
            request.output('po_UpdatedTime',sql.DateTime)
            request.output('po_Message',sql.VarChar)
            // query to the database and get the records
            request.execute("[dbo].[ARA_SP_DS_GetApplicationUsers]").then(function(recordSet) {
                if (recordSet == null || recordSet.recordsets[0].length=== 0 || recordSet === undefined )
                {
                    console.log('Not Exists!');
                    res.status(401).send({
                        message: 'Not Exists'
                        });
                    return;
                }
                else{
                    data=recordSet.recordsets[1][0];
                    if (username === data.MX_LOGIN_ID) {
                        sql.close();
                        console.log('Approved')
                        // res.send(data)
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
                    else {
                        console.log('Access denied Main')
                        res.status(401).send({
                        message: 'Access denied'
                        });
                    }
                }
                sql.close();
            }).catch(function (err) {         
                console.log(err);
                res.status(404).send({
                    message: 'Server Error'
                    });
                sql.close();
            });
        });
    });
    return router;
}