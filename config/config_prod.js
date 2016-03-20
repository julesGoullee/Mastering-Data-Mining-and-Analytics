'use strict';
module.exports = {
    port: 3000,
    log: true,
    api : {
        active : true,
        esAddress: "172.17.0.1:9200",
        mongo: {
            ip: "172.17.0.1",
            base: "mdma"
        }
    },
    webServer: {
        active: true,
        apiAddress: "127.0.0.1",
        apiPort: 80
    }
};
