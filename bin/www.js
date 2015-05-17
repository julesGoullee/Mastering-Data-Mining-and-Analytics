'use strict';

var app = require('../app');
var debug = require('debug')('mastering-data-mining-and-analytics:server');
var http = require('http');
var io = require('socket.io');
var socketHandler = require('../modules/socketHandler/socketHandler.js');
var clientNotifier = require('../modules/clientNotifier/clientNotifier.js');


var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);

var _io = io(server);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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
    var addr = server.address();
    console.log('Listening on port ' + addr.port);
    socketHandler.listen( _io );
    clientNotifier.connect();
}
