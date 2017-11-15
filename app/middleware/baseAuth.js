 /***
    * This is Application Basic Authentication Middleware
    * Each and every request will intercept this function atleast once
  ***/
(function() {
    'use strict';
    //Invoking the required modules using 'require'
    var bodyParser = require('body-parser'),
        jwt = require('jsonwebtoken'),
        config = require('../../config/config'),
        secretKey = config.secret;

    // Writing the module for basic authentication purpose
    module.exports = function(app,express) {
        app.use(function(req, res, next) {
                // Checking the token exists in the request or not
                var token = req.body.token || req.query.token || req.headers['x-access-token'];
                if (token) {
                    //Verifying the token
                    jwt.verify(token, secretKey, function(err, decoded) {
                        if (err) {
                            //If verification fails, Will send message to User
                            res.status(401).send({
                                success: false,
                                error_code:'token',
                                message: 'Failed to authenticate token.'
                            });
                        } else {
                            //If Verified Succesffully, It will pass to next action
                            req.decoded = decoded;
                            next();
                        }
                    });
                } 
                else {
                    //If no token provided, will send message to User
                    res.status(401).send({
                        success: false,
                        message: 'No token provided.'
                    });
                }
        });
        return app;
    };
}());