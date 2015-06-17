'use strict';
module.exports = {
    port: 3000,
    api : {
        active : true,
        esAddress: "127.0.0.1:9200",
        mongo: {
            ip: "127.0.0.1",
            base: "mdma"
        },
        domain:"masteringdata.ddns.net"
    },
    webServer: {
        active: true,
        apiAddress: "masteringdata.ddns.net",
        apiPort: 80
    }
};
