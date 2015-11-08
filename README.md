## Mongo-CRUD


### What is Mongo-CRUD

Mongo-CRUD is a simple wrapper library for the Nodejs MongoDB drivers avaliable. The libarary traspeartly manages how connections are made to Mongo database and manages the creation and destruction of these connections. Aside from connection to the database the Mongo-CRUD also provides a simple to use interface for the following operations (*Hint: it's gonna be CRUD!*):

* **C**reating documents and Collections.
* **R**etrieving documents from MongoDB collections.
* **U**pdating documents with in MongoDB collections.
* **D**elete documents from MongoDB collections.


## Usage

### Installation
You can install mongo-crud using the npm tool with the following command.
```
npm install --save mongo-crud
```

### Connecting to MongoDB
Connecting to MongoDB should be done during the initialization stages of starting up your server application use the library in your project using the ```require``` module then call ```connect``` with a callback function as shown below.
```
var crud = require('mongo-crud');

crud.connect('mongodb://{host}:{port}/{database}', function(err) {
	if(err) throw err;
    // Start your application here!
});
```

The connect function only needs to be called once during the application initialization phase. Just ```require``` the module where ever else you may need it in your application and ```mongo-crud``` will know how to connect to your database.

## CRUD Operations

### **C**reate
The create operation saves any object passed as a document to the MongoDB collection specified in the call. If the collection does not exist, MongoDB will create it the first time you try saving a document to it. 

 * @param {string} collection The name of the target mongo collection.
 * @param {object} doc The document to be stored.
 * @param {function} callback The command result callback.
 * @return {null}

The following example shows how to store the object ```{foo: bar}``` to the collection **Foo**.
```
  mongo.create('Foo', {foo: bar}, function (err, result) {
      if (err) throw err;
      
      // process the result here. 
  });

```
## Dependencies

 * [mongodb](https://github.com/mongodb/node-mongodb-native) - The mongodb drivers for Nodejs.

## License
* MIT
