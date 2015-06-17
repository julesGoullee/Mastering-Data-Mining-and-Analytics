'use strict';
module.exports = {
    port: 3000,
    api : {
        active : false,
        esAddress: "127.0.0.1:9200",
        mongo: {
            ip: "127.0.0.1",
            base: "mdma"
        },
        domain:"127.0.0.1"
    },
    webServer: {
        active: true,
        apiAddress: "masteringdata.ddns.net",
        apiPort: 80
    }
};
