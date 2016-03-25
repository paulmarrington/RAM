import mongodb = require('mongodb');

var server = new mongodb.Server('localhost', 27017, {auto_reconnect: true})

/* exported for direct mongo manipulation when helpers aren't enough */
export var db = new mongodb.Db('ram', server, { w: 1 });

/* find a single document */
export var findOne = function(collection:string, query, options) {
  return db.collection(collection).findOne(query, options)
}

/* find all matching documents */
export var findAll = function(collection:string, query) {
  return db.collection(collection).find(query)
}

/* return a document give it's primary key (_id) */
export var read = function(collection:string, _id:string, options) {
  var query = { _id: mongodb.ObjectID(_id); }
  return db.collection(collection).findOne(query, options)
}

/* correct for conversion to string */
export var ObjectID(_id) { return mongodb.ObjectID(_id) }

/* change the contents of a document referred to by primary key */
export var updateOne = function(collection:string, _id:string, updates) {
  var query = { _id: mongodb.ObjectID(_id); }
  updates.lastUpdatedTimestamp = new Date()
  return db.collection(collection).updateOne(query, {$set: updates})
}

/* change the contents of a document referred to by primary key */
export var insertOne = function(collection:string, document) {
  document.lastUpdatedTimestamp = new Date()
  return db.collection(collection).insertOne(document)
}

db.open(function() {});
