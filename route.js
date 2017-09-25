var express = require('express');


var app = express();
var router = express.Router();

router.get('/spotcheck', function(req, res, next) {
        res.render('./service');
});

router.get('/upload', function(req, res, next) {
    console.log('at upload route');
        res.render('./upload');
});

var server = app.listen(5000, function () {
    console.log('Server is running at port 5000..');
});

