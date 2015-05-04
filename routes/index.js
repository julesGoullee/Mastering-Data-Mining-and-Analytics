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
        "external/angular-material-icons.min",


        //modules
        "main",
        "controllers/mainController",
        "directives/representation/representation",
        "directives/topBar/topBar",
        "directives/contextMenu/contextMenu"
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
