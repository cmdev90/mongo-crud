
// The global connection object shared throught the application.
// This is however made private to the mongo-crud library. To alter
// use the CRUD.connect() method.
var connection;

// Create a namespace for the crud operations.
var CRUD = CRUD || {};

var Create = CRUD.create = function (collection, doc, done) {

};

var Retrieve = CRUD.retrieve = function (collection, criteria, done) {

};

var Update = CRUD.update = function (collection, criteria, done) {

};

var Delete = CRUD.delete = function (collection, criteria, done) {

};


/**
 * Opens a Single connection to the MongoDB instance. The instance can be changed
 * at anytime by calling this function again.
 * @param {string} url The connection URI string
 * @param {CRUD~connectCallback} callback The command result callback
 * @return {null}
 */
var Connect = CRUD.connect = function (url, callback) {
  
  
};

// Helper functions
// ----------------------------------------------------------

/**
 * This helper function is used to execute callback functions in a save way. Provides
 * use for up to 3 passed parameters to the calling function.
 * @param {function} fn The function to be called.
 * @param {any} param1 The first parameter to be passed to the function.
 * @param {any} param2 The second parameter to be passed to the function.
 * @param {any} param3 The third parameter to be passed to the function.
 */
var call = function(fn, param1, param2, param3) {
  if (typeof fn === 'function') {
    return fn(param1, param2, param3);
  }
};


module.exports = CRUD;
