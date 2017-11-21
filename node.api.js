// Main application node - web-backend & REST microservice <=> DB miroservice handlers
////
let {ServiceBroker}  = require("moleculer");
let ApiService = require("moleculer-web");

//broker iitialisation
let broker = new ServiceBroker({
    logger: console,
    nodeID: 'api-node',
    transporter: "nats",
    hotReload: true
});

broker.loadService("phone.service.js");

//http endpoint
broker.createService({
    name: "api",
    mixins: [ApiService],
    settings: {
	port: 7777,
	assets: {
	    folder: './assets'
	},

	routes: [{
	    path: '/api'
	}]
    }
});

broker.start();
