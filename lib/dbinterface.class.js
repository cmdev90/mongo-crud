(function (client, ObjectID){
  /**
   * Opens a Single connection to the MongoDB instance. The instance can be changed
   * at anytime by calling this function again.
   * @param {string} URL The connection URI string
   * @param {CRUD~connectCallback} callback The command result callback
   * @return {null}
   */
  var dbinterface = function (options) {
    this.port = options && options.port ? options.port : 27017;
    this.host = options && options.host ? options.host : 'localhost';
    this.db = options && options.db ? options.db : 'default';
  };

  dbinterface.prototype.getConnectionString = function () {
    return 'mongodb://' + this.host + ':' + this.port + '/' + this.db;
  };

  /**
   * The create operation is used to add new documents to collections.
   * @param {string} collection The name of the target mongo collection.
   * @param {object} doc The document to be stored.
   * @param {function} callback The command result callback.
   * @return {null}
   */
  var insert = dbinterface.prototype.insert = function (doc, callback) {
    var context = this;

    client.connect(context.getConnectionString(), function(err, db) {
      if (err) return call(callback, err);

      var collection = db.collection(context.collection);
      collection.insert(doc, function (err, result){
        db.close();
        call(callback, err, result);
      });    
    });
  };

  /**
   * Returns an array of documents from the collection that matches the criteria.
   * @param {string} collection The name of the target mongo collection.
   * @param {object} criteria The match criteria for the mongo where clause.
   * @param {function} callback The command result callback.
   * @return {null}
   */
  var find = dbinterface.prototype.find = function (criteria, callback) {
    var callback = typeof criteria === 'function' ? criteria : callback
      , where = typeof criteria === 'function' ? {} : criteria
      , context = this;

    client.connect(context.getConnectionString(), function (err, db) {
      if (err)
        return call(callback,err);
    
      var collection = db.collection(context.collection);
      collection.find(where).toArray(function (err, docs) {
        db.close();
        call(callback, err, docs);
      });
    });
  };

  /**
   * The update operation is used to update a document from the specified collection. This method only
   * works to update whole documents. Document `_id` property must be included in the passed document to
   * help identify it.
   * @param {string} collection The name of the target mongo collection.
   * @param {object} criteria The document to be stored.
   * @param {function} callback The command result callback.
   * @return {null}
   */
  var update = dbinterface.prototype.update = function (doc, where, callback) {
    var callback = typeof where === 'function' ? where : callback
      , where = typeof where === 'function' ? {} : where
      , context = this;

    // In the case of updating whole documents we must verify save and remove the _id
    // parameter from the document as it is illegal to attempt to update this.
    // var id;
    if (doc.hasOwnProperty('_id')) {
      where = {_id: ObjectID(doc._id)}
      delete doc._id
    }

    // Open the connection and update the document.
    client.connect(context.getConnectionString(), function (err, db) {
      if (err) {  
        call(callback, err);
      }
      else {
        var collection = db.collection(context.collection);
        collection.update(where, {$set: doc}, {multi:true}, function(err, result) {
          db.close();
          result = result ? result.result : null;
          call(callback, err, result);
        });  
      }
    });
  };

  /**
   * The delete operation is used to remove documents from the specified collection
   * that matches the criteria.
   * @param {string} collection The name of the target mongo collection.
   * @param {object} doc The document to be stored.
   * @param {function} callback The command result callback.
   * @return {null}
   */
  var remove = dbinterface.prototype.remove = function (criteria, callback) {
    var callback = typeof criteria === 'function' ? criteria : callback
      , criteria = typeof criteria === 'function' ? {} : criteria
      , context = this;


    client.connect(context.getConnectionString(), function (err, db) {
      if (err) {
        call(callback, err);
      }
      else {
        var collection = db.collection(context.collection);
        collection.remove(criteria, function (err, result) {
          db.close();
          result = result ? result.result : null;
          call(callback, err, result);
        });
      }
    });
  };

  dbinterface.prototype.setCollection = function (collection) {
    this.collection = collection.toLowerCase();
  }


  /**
   * Checks if the object has been initilized. A succesfully initialized object has a 
   * valid tested connection.
   * @return {boolean} The boolean flag for connection state True or False.
   */
  dbinterface.prototype.ready = function (){
    return this.url === null;
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
      return fn(err, param1, param2, param3);
    }

    // If there is an error and no function to pass to throw the error 
    // into the wild to punish the wickedness within thy callers' heart.
    if (err) {
      throw err;
    }
  };

  return module.exports = dbinterface;
})(require('mongodb').MongoClient, require('mongodb').ObjectID);