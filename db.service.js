"use strict";
var _ = require('lodash');
const DbService = require("moleculer-db");

module.exports = {
    name: "db",
    mixins: [DbService],
    settings: {
	fields: ["number", "name"]
    },
    
    actions: {

	////
	//find by name or phone number
	find: {
	    responseType: "application/json",
	    handler(ctx) {
		var numberVal = ctx.params.query.number;
		var nameVal = ctx.params.query.name;
		var getAll = ctx.params.query.getall; //true -> return all records for 'Managment' view
		var query = {};

		//just fetch all records?
		if(this.isValid(getAll)){
		    return new this.Promise((resolve,reject) => {
			this.adapter.find().then(res => {
			    if(res == null){
				resolve({context: {error: true, message: "Database empty"}});
			    } else {
				resolve({context: {error: false, result: res}});
			    }
			});
		    });
		}


		if(this.isValid(numberVal)){
		    query.number = numberVal;
		}
		if(this.isValid(nameVal)){
		    query.name = nameVal;
		}
	
		return new this.Promise((resolve,reject) => {
		    if(!_.isEmpty(query)){
			this.adapter.findOne(query).then(res => {
			    if(res == null){
				resolve({context: {error: true, message: "User not found"}});
			    } else {
				resolve({context: {error: false, result: res}});
			    }
			});
		    } else {
			resolve({context: {error: true, message: "Invalid query: provide user name or phone"}});
		    }
		});
	    }
	},

	////
	//delete user record
	remove: {
	    responseType: "application/json",
	    handler(ctx){
		return new Promise((resolve, reject) => {
		    var uid = ctx.params.query.uid;
		    this.adapter.removeById(uid);
		    resolve({context: {error: false}});
		});
	    }
	},

	////
	//update user record or add new one (if 'uid' are empty) 
	manage: {
	    responseType: "application/json",
	    handler(ctx){
		return new Promise((resolve, reject) => {
		    var data = ctx.params.query;

		    if(this.isValid(data.new_name) && this.isValid(data.new_number)){
			var update = {name: data.new_name, number: data.new_number};

			//update record if we hav UID or just insert new one
			if(this.isValid(data.uid)){
			    this.adapter.updateById(data.uid, update);
			} else {
			    this.adapter.insert(update);
			}
		    
			resolve({context: {error: false}});
		    } else {
			resolve({context: {error: true, message: "Empty fields are not allowed"}});
		    }
		});
	    }
	}
    },

    //service started - feed DB
    started() {
	this.adapter.insert({number: '123-4321-1', name: 'Name1'});
	this.adapter.insert({number: '123-4321-2', name: 'Name2'});	
    },

    methods: {
	isValid(param){
	    return (typeof param !== 'undefined' && param.length > 0);
	}
    }
};
