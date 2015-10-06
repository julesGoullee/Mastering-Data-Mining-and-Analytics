'use strict';
var app = require("../app").app;
var http = require("http");
var config = require("../config/config.js");

app.set( "port", config.port );
var server = http.createServer( app );
server.listen( config.port, "0.0.0.0" );

if( config.api.active ) {
    var sessionMiddleware = require("../app").sessionMiddleware;
    var io = require("socket.io");
    var socketHandler = require("../modules/socketHandler/socketHandler.js");
    var clientNotifier = require("../modules/clientNotifier/clientNotifier.js");
    var User = require('../modules/users/modelUser');
    var _io = io( server ).use(function( socket, next ){
        sessionMiddleware(socket.request, {}, function(a, b){
            if( socket.request.session &&
              socket.request.session.passport &&
              socket.request.session.passport.user ) {
                User.findById(socket.request.session.passport.user, function (err, user) {
                    socket.request.profile = user;
                    next(err);
                });
            } else{
                next(false);
            }
        });
    });
}
server.on( "error", onError );
server.on( "listening", onListening );

function onError( error ){

    if( error.syscall !== "listen" ){
        throw error;
    }

    var bind = typeof config.port === "string"
        ? "Pipe " + config.port
        : "Port " + config.port;

    switch( error.code ){
        case "EACCES":
            console.error( bind + " requires root privileges" );
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error( bind + " is already in use" );
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(){

    var addr = server.address();
    console.log("Listening on port " + addr.port);

    if( config.api.active ) {
        var esConnector = require("../modules/elasticSearch/elasticSearchConnector.js");

        esConnector.connect().then(function (){

            console.info("Elasticsearch connection [OK]");

            socketHandler.listen(_io);
            clientNotifier.connect();

        }, function( err ){
            console.error("Elasticsearch connection [FAIL]: " + err );
        });
    }
}
