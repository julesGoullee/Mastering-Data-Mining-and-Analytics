'use strict';

var app = require("../app").app;
var http = require("http");
var config = require("../config/config.js");

//var noIpConnector = require("../modules/serverConfig/noipConfig.js");
//var debug = require('debug')('mastering-data-mining-and-analytics:server');
//noIpConnector.updateIp();

app.set('port', config.port);
var server = http.createServer(app);
server.listen(config.port, "0.0.0.0");

if( config.api.active ) {
    var sessionMiddleware = require("../app").sessionMiddleware;
    var io = require("socket.io");
    var socketHandler = require("../modules/socketHandler/socketHandler.js");
    var clientNotifier = require("../modules/clientNotifier/clientNotifier.js");
    var _io = io(server).use(function (socket, next) {
        sessionMiddleware(socket.request, {}, next);
    });
}
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof config.port === 'string'
        ? 'Pipe ' + config.port
        : 'Port ' + config.port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires root privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {

    var addr = server.address();
    console.log('Listening on port ' + addr.port);

    if( config.api.active ) {
        var esConnector = require('../modules/elasticSearch/elasticSearchConnector.js');

        esConnector.connect().then(function () {

            console.log('Elasticsearch connection [OK]');

            socketHandler.listen(_io);
            clientNotifier.connect();

        }, function (error) {
            console.log('Elasticsearch connection [FAIL]');
        });
    }
}
