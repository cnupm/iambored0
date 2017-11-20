let {ServiceBroker}  = require("moleculer");
let ApiService = require("moleculer-web");

let broker = new ServiceBroker({
    logger: console,
    nodeID: 'db-node',
    transporter: "nats",
    hotReload: true
});

broker.loadService("db.service.js");
broker.start();
