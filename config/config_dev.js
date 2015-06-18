'use strict';
module.exports = {
    port: 3000,
    log: false,
    api : {
        active : true,
        esAddress: '192.168.0.34:9200',
        mongo: {
            ip: "127.0.0.1",
            base: "mdma"
        }
    },
    webServer: {
        active: true,
        apiAddress: "127.0.0.1",
        apiPort: 3000
    }
};
