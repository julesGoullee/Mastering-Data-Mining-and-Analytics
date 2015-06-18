'use strict';
module.exports = {
    port: 3000,
    log: true,
    api : {
        active : true,
        esAddress: "127.0.0.1:9200",
        mongo: {
            ip: "127.0.0.1",
            base: "mdma"
        }
    },
    webServer: {
        active: true,
        apiAddress: "masteringdata.ddns.net",
        apiPort: 80
    }
};
