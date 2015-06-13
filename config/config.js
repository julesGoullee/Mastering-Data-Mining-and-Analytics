'use strict';
module.exports = {
    api : {
        active : true,
        esAddress: '192.168.0.34:9200',
        mongo: {
            ip: "127.0.0.1",
            base: "mdma"
        },
        port: 3000,
        domain:"127.0.0.1"
    },
    webServer: {
        active: true,
        apiAddress: "127.0.0.1",
        apiPort: 3000
    }
};
