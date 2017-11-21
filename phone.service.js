// REST backend microservice implementation
////
"use strict";

module.exports = {
    name: "phone",
    actions: {

	find: {
	    responseType: "application/json",
	    handler(ctx) {
		return new this.Promise((resolve,reject) => {
		    ctx.broker.call("db.find", {query: ctx.params}).then(res => {
			resolve(res.context);
		    });
		});
	    }
	},

	remove: {
	    responseType: "applicatio/json",
	    handler(ctx){
		return new Promise((resolve, reject) => {
		    ctx.broker.call("db.remove", {query: ctx.params}).then(res => {
			resolve(res.context);
		    });
		});
	    }
	},

	manage: {
	    responseType: "application/json",
	    handler(ctx){
		return new Promise((resolve, reject) => {
		    ctx.broker.call("db.manage", {query: ctx.params}).then(res => {
			resolve(res.context);
		    });
		});
	    }
	}

    }
};
