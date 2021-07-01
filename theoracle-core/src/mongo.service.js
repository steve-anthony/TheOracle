
var MongoClient = require('mongodb').MongoClient;
const fs = require('fs')

module.exports = class MongoService {

	instance = null;

	static getInstance() {
		if (this.instance == null) {
			this.instance = new MongoService();
		}
		return this.instance;
	}

	url = "localhost:27017";
	database;
	user;
	password;

	static COINS = "coins";
	static REPORT = "report";
	static SAFEMOON = "safemoon";

	constructor() {

	}

	/**
	 * To connect DB
	 */
	async init() {
		// fetch user & password if possible
		try {
			var PasswordTMP = require('../tmp/password.json');
			this.user = PasswordTMP[0];
			this.password = PasswordTMP[1];
		} catch (e) {
			console.log("No auth file");
		}

		// if we are in docker we get the adress of mongo
		// else we use localhost
		if (process.env.MONGO_URL != null) {
			this.url = process.env.MONGO_URL;
		}

		// if we have ID/PASSWORD we use it
		// else we connect without auth
		if (this.user != null && this.password != null) {
			this.url = "mongodb://" + this.user + ":" + this.password + "@" + this.url;
			console.log("MONGO : with auth");
		} else {
			this.url = "mongodb://" + this.url;
			console.log("MONGO : no auth");
		}

		// try to connect db
		try {
			const client = await MongoClient.connect(this.url + "/oraclecrypto");
			this.database = client.db('oraclecrypto');
			console.log("Connexion succed.")
		} catch (err) {
			throw new Error('Connexion BDD Fail : ', err);
		}

	}

	async find(collection, query) {

		return await this.database.collection(collection).find(query);
	}

	async findAndSort(collection, query, sortingQuery) {

		return await this.database.collection(collection).find(query).sort(sortingQuery).toArray();
	}

	async update(collection, where, toUp) {

		return await this.database.collection(collection).update(where, toUp);

	}

	async insert(collection, objToInsert) {

		return await this.database.collection(collection).insertOne(objToInsert);

	}

	async close() {
		await this.database.close();
	}

}
