'use strict';
module.exports = {
    port: 3000,
    api : {
        active : true,
        esAddress: '192.168.0.4:9200',
        mongo: {
            ip: "127.0.0.1",
            base: "mdma"
        },
        domain:"127.0.0.1"
    },
    webServer: {
        active: true,
        apiAddress: "127.0.0.1",
        apiPort: 3000
    }
};
