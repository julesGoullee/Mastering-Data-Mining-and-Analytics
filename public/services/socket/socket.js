"use strict";

angularApp.factory("socket", function( config, socketFactory ){
    
    var myIoSocket = io.connect( "http://" + config.url + ":" + config.port );

    return socketFactory({
        ioSocket: myIoSocket
    });

    //return socketFactory("http://" + config.url + ":" + config.port);
});