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
        "external/angular-socket-io",
        "external/d3",


        //modules
        "main",
        "controllers/mainController",
        "directives/representation/representation"
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
