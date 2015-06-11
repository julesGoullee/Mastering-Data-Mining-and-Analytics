var express = require("express");
var router = express.Router();
var config = require("../config/config.js");

if( config.api.active ){
    var auth = require("./auth.js");
}

var dependances = {

    scripts:[
        "//" + config.webServer.apiAddress + ":" + config.webServer.apiPort + "/socket.io/socket.io",
        "external/jquery",
        "external/angular",
        "external/angular-aria",
        "external/angular-animate",
        "external/angular-material",
        "external/angular-socket-io",
        "external/d3",
        "external/angular-material-icons.min",
        "external/ng-context-menu.min",


        //modules
        "main",
        "const/const",
        "controllers/mainController",
        "services/graphConfig",
        "directives/representation/representation",
        "directives/representation/graphFactory",
        "directives/topBar/topBar",
        "directives/contextMenu/contextMenu",
        "directives/tweetHeartbeat/tweetHeartbeat"
    ],
    css:[
        "external/angular-material",
        "css/style"
    ]
};

if( config.api.active ){
    router.get("/", auth.ensureAuthenticated, function (req, res, next) {
        res.render("index", {dependances: dependances, title: "M.D.M.A - Project"});
    });
}
else {
    router.get("/", function (req, res, next) {
        res.render("index", {dependances: dependances, title: "M.D.M.A - Project"});
    });
}
module.exports = router;
