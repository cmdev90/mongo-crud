var MongoClient = require('mongodb').MongoClient

// The global connection string shared throughout the application.
// This is however made private to the mongo-crud library. To alter
// use the CRUD.connect() method passing the new url.
var URL;

// Create a namespace for the crud operations.
var CRUD = CRUD || {};

var Create = CRUD.create = function (collection, doc, callback) {

    var collectionName = collection.toLowerCase();

    mongo.connect(url, function(err, db) {

      if (err) throw err;

      console.log('Connected correctly to server and creating new document.');

      // Get the collection
      var collection = db.collection(collectionName);
      collection.insert(doc, function (err, result){
        console.log(doc, result)
        callback(err, result.ops[0]);
        db.close();
      });
    });

};

var Retrieve = CRUD.retrieve = function (collection, criteria, callback) {

  var collectionName = collection.toLowerCase();

  if (typeof criteria === 'function'){
    callback = criteria;
    criteria = {};
  }

  mongo.connect(url, function (err, db) {

    if (err) throw err;

    console.log('Connected correctly to the server and retrieving documents.');

    var collection = db.collection(collectionName);
    collection.find(criteria).toArray(function (err, docs) {
      if (typeof callback === 'function')
        callback(err, docs);
      db.close();
    });
  });

};

var Update = CRUD.update = function (collection, criteria, callback) {

  console.log("Updating", doc);

  var collectionName = collection.toLowerCase();

  if (typeof doc === 'function') 
    return callback(new Error('Mongo object required as second parameter'));

  mongo.connect(url, function (err, db) {

    if (err) return callback(err);

    console.log('Connected correctly to the server and updating document.');

    var collection = db.collection(collectionName);

    // in the case of updating whole documents we must remove the _id
    // parameter as it is illegal to attempt to update this.
    var id;
    if (doc.hasOwnProperty('_id')) {
      id = ObjectID(doc._id);
      delete doc._id
    }
    else if (typeof callback === 'function')
        return callback({ 'message': 'Key violation. A proper mongo document must be passed with the _id attribute.' });

    collection.update({_id: id}, {$set: doc}, function(err, result) {
      result.doc = doc;
      callback(err, result);
      db.close();
    });  
  });

};

var Delete = CRUD.delete = function (collection, criteria, callback) {

  var collectionName = collection.toLowerCase();

  if (typeof criteria === 'function') 
    return callback(new Error('Delete criteria required as second parameter'));

  mongo.connect(url, function (err, db) {

    if (err) 
      return callback(err);

    var collection = db.collection(collectionName);

    collection.remove(criteria, function (err, result) {
      callback(err, result);
      db.close();
    });
  });
  
};


/**
 * Opens a Single connection to the MongoDB instance. The instance can be changed
 * at anytime by calling this function again.
 * @param {string} url The connection URI string
 * @param {CRUD~connectCallback} callback The command result callback
 * @return {null}
 */
var Connect = CRUD.connect = function (url, callback) {

  // Use connect method to test the connection to the Server
  MongoClient.connect(url, function(err, db) {
  
    // If the connect function returned the proper instance of db, set the global url to the working
    // connection string and close the connection as it will not be used.
    if (db && db.close) {
      URL = url;
      db.close();
    }

    // The db object will always be handled internally.
    // call(callback, err, db)
    return call(callback, err);

  });

};

// Helper functions
// ----------------------------------------------------------

/**
 * This helper function is used to execute callback functions in a save way. Provides
 * use for up to 3 passed parameters to the calling function.
 * @param {function} fn The function to be called.
 * @param {object} err The error object to be passed to the function.
 * @param {any} param1 The first parameter to be passed to the function.
 * @param {any} param2 The second parameter to be passed to the function.
 * @param {any} param3 The third parameter to be passed to the function.
 */
var call = function(fn, err, param1, param2, param3) {
  if (typeof fn === 'function') {
    return fn(param1, param2, param3);
  }

  // If there is an error and no function to pass to throw the error 
  // into the wild to punish the wickedness within thy callers' heart.
  if (err) {
    throw err;
  }

};


module.exports = CRUD;
