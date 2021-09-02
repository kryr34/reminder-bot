const { MongoClient } = require('mongodb');

module.exports.myMongoClient = class myMongoClient {
	constructor(url) {
		this.mongoClient = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
		this.connection = this.mongoClient.connect();
	}
	insert(obj,db,collection){
		return this.connection
		.then(connection =>{
			const dbo = connection.db(db).collection(collection);
			return dbo.insertOne(obj);
		})
		.then(res => console.log(`[db]\tinsert {${res.insertedId}} to ${db}.${collection}`))
	}
	delete(query,db,collection){
		return this.connection
		.then(connection =>{
			const dbo = connection.db(db).collection(collection);
			return dbo.deleteOne({ _id: query._id });
		})
		.then(res => console.log(`[db]\tdelete {${res.insertedId}} on ${db}.${collection}`))
	}
	find(query,db,collection){
		return this.connection
		.then(connection =>{
			const dbo = connection.db(db).collection(collection);
			return dbo.find(query);
		})
		//.then(console.log)
	}
	findOne(query,db,collection){
		return this.connection
		.then(connection =>{
			const dbo = connection.db(db).collection(collection);
			return dbo.findOne(query);
		})
		//.then(console.log)
	}
	updateOne(filter, updateDoc, db, collection){
		return this.connection
		.then(connection =>{
			const dbo = connection.db(db).collection(collection);
			return dbo.updateOne({ _id: filter._id }, { $set: updateDoc });
		})
		//.then(console.log)
	}
	count(query,db,collection){
		return this.connection
		.then(connection =>{
			const dbo = connection.db(db).collection(collection);
			return dbo.count(query);
		})
	}
	close(){this.mongoClient.close()}
}