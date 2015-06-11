'use strict';
module.exports = {
    api : {
        active : true,
        esAdress: '192.168.1.19:9200',
        mongo: {
            ip: "127.0.0.1",
            base: "mdma"
        },
        port: 3000,
        domain:'localhost'
    },
    webServer: {
        active: true,
        apiAdress: "localhost",
        apiPort:3000
    }
};
