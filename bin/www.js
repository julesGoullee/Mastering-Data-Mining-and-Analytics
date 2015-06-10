'use strict';

var app = require("../app").app;
var sessionMiddleware = require("../app").sessionMiddleware;
var http = require("http");
var config = require("../config/config.js");
if( !config.onlyClient ) {
    var io = require("socket.io");
    var socketHandler = require("../modules/socketHandler/socketHandler.js");
    var clientNotifier = require("../modules/clientNotifier/clientNotifier.js");
}
//var noIpConnector = require("../modules/serverConfig/noipConfig.js");
//var debug = require('debug')('mastering-data-mining-and-analytics:server');


var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);

server.listen(port, "0.0.0.0");
if( !config.onlyClient ) {
    var _io = io(server).use(function (socket, next) {
        sessionMiddleware(socket.request, {}, next);
    });
}
server.on('error', onError);
server.on('listening', onListening);

//noIpConnector.updateIp();

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

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
    if( !config.onlyClient ) {
        var esConnector = require('../modules/elasticSearch/elasticSearchConnector.js');

        esConnector.connect().then(function () {

            console.log('Elasticsearch connection [OK]');
            var addr = server.address();
            console.log('Listening on port ' + addr.port);
            socketHandler.listen(_io);
            clientNotifier.connect();

        }, function (error) {
            console.log('Elasticsearch connection [FAIL]');
        });
    }
}
