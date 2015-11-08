var client = require('mongodb').MongoClient

// The global connection string shared throughout the application.
// This is however made private to the mongo-crud library. To alter
// use the CRUD.connect() method passing the new URL.
var URL;

// Creating a namespace for the crud operations.
var CRUD = CRUD || {};


/**
 * The create operation is used to add new documents to collections.
 * @param {string} collection The name of the target mongo collection.
 * @param {object} doc The document to be stored.
 * @param {function} callback The command result callback.
 * @return {null}
 */
var Create = CRUD.create = function (collection, doc, callback) {

  // Check to see that the call to the connect function was made and if not abort operation.
  if (!URL) { 
    call(callback, new Error('Cannot perform CRUD operations until connect is called with a valid Mongo Server URI.'));
  }
  else {
    var collectionName = typeof collection === 'string' ? collection.toLowerCase() : null;

    if (!collectionName) {
      call(callback, new Error('No collection name specified.'));
    }
    else {
      client.connect(URL, function(err, db) {
        if (!err) {
          var collection = db.collection(collectionName);
          collection.insert(doc, function (err, result){
            db.close();
            call(callback, err, result);
          });
        }
        else {
          call(callback, err);
        }
      });
    }
  }

};

/**
 * Returns an array of documents from the collection that matches the criteria.
 * @param {string} collection The name of the target mongo collection.
 * @param {object} criteria The match criteria for the mongo where clause.
 * @param {function} callback The command result callback.
 * @return {null}
 */
var Retrieve = CRUD.retrieve = function (collection, criteria, callback) {
  var collectionName = typeof collection === 'string' ? collection.toLowerCase() : null
    , where = typeof criteria === 'function' ? {} : criteria
    , callback = typeof criteria === 'function' ? criteria : callback;

  if (!URL) {
    call(callback, new Error('Cannot perform CRUD operations until connect is called with a valid Mongo Server URI.'));
  }
  else {
    if (!collectionName) {
      call(callback, new Error('No collection name specified.'));
    }
    else {
      client.connect(URL, function (err, db) {
       if (err) {
         call(callback,err);
       }
       else {
         collection.find(where).toArray(function (err, docs) {
           db.close();
           call(callback, err, docs);
         });
       }
      });
    }
  }
};

var Update = CRUD.update = function (collection, criteria, callback) {

  console.log("Updating", doc);

  var collectionName = collection.toLowerCase();

  if (typeof doc === 'function') 
    return callback(new Error('Mongo object required as second parameter'));

  client.connect(URL, function (err, db) {

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

  client.connect(URL, function (err, db) {

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
 * @param {string} URL The connection URI string
 * @param {CRUD~connectCallback} callback The command result callback
 * @return {null}
 */
var Connect = CRUD.connect = function (url, callback) {

  console.log('Testing database connection...');
  client.connect(url, function(err, db) {

    if (!err) {
      console.log('Success!');
      URL = url;
      db.close();
    }

    call(callback, err);

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
 * @return {null}
 */
var call = function (fn, err, param1, param2, param3) {
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
