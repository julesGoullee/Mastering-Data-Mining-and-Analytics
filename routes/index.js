var express = require('express');
var router = express.Router();

var dependances = {

    scripts:[
        "socket.io/socket.io",
        "external/jquery",
        "external/angular",
        "external/angular-aria",
        "external/angular-animate",
        "external/angular-material",

        //modules
        "modules/socket"
    ],
    css:[
        "external/angular-material",
        "css/style"
    ]
};

router.get('/', function(req, res, next) {
    res.render('index', { dependances: dependances, title: 'Express' });
});

module.exports = router;
