var Mongo = require('./');
var assert = require('chai').assert;

var db = 'mongodb://localhost/triniclassifieds'
var alias = 'Classifieds';

var person = {
  name: 'Kalidia', 
  position: 'Cow Mechanic', 
  rank: '...'
};

var DBInterface = require('./lib/dbinterface.class');
var dbOptions = {
  host: 'localhost',
  port: 27017,
  db: 'triniclassifieds'
}

describe('DBInterface.Class', function () {
  it('should be of type function', function (){
    assert.isFunction(DBInterface);
  });

  it('should have `host`, `port` and `db` property when instantiated.', function (){
    var dbinterface = new DBInterface(dbOptions);
    assert.equal(dbinterface.host, dbOptions.host, 'the `host` property was set.');
    assert.equal(dbinterface.port, dbOptions.port, 'the `port` property was set.');
    assert.equal(dbinterface.db, dbOptions.db, 'the `db` proeprty was set.');
  });

  it('should have a default connectionString when instantiated with no options.', function (){
    var dbinterface = new DBInterface();
    assert.isFunction(dbinterface.getConnectionString);
    assert.isString(dbinterface.getConnectionString());
    assert.equal(dbinterface.getConnectionString(), 'mongodb://localhost:27017/default');
  });

  it('should expose functions `insert`, `find`, `update` and `remove` when instantiated.', function (){
    var dbinterface = new DBInterface();
    assert.isFunction(dbinterface.insert);
    assert.isFunction(dbinterface.find);
    assert.isFunction(dbinterface.update);
    assert.isFunction(dbinterface.remove);
  });

  describe('#setCollection', function () {
    it('should set the object collection for executing queries.', function () {
      var dbinterface = new DBInterface();
      assert.isFunction(dbinterface.setCollection);

      dbinterface.setCollection('sample');
      assert.isNotNull(dbinterface.collection);
      assert.isString(dbinterface.collection);
      assert.equal(dbinterface.collection, 'sample');
    });
  });

  describe('#insert()', function () {
    it('should add person object to the People collection.', function (done) {
      var dbinterface = new DBInterface();
      dbinterface.setCollection('sample');

      dbinterface.insert(person, function (err, result) {
        assert.isNull(err, 'there was no error');
        assert.isNotNull(result, 'there was no error');
        assert.equal(1, result.result.ok);
        assert.equal(1, result.ops.length, 'singel person record added.');
        done();
      });
    });
  });

  describe('#find()', function() {
    it('should find all people records.', function (done){
      var dbinterface = new DBInterface();
      dbinterface.setCollection('sample');

      assert.isString(dbinterface.collection);
      
      dbinterface.find(function (err, result) {
        if(err) return done(err);
        assert.isAtLeast(result.length, 1, 'there is at least one person record returned.');
        done();
      });
    });

    it('should find people records with the name `Kalidia`.', function (done) {
      var dbinterface = new DBInterface();
      dbinterface.setCollection('sample');
      
      dbinterface.find({'name': 'Kalidia'}, function (err, people) {
        if(err) return done(err);
        
        assert.isArray(people);
        assert.isAtLeast(people.length, 1, 'there is at least one person record returned.');
        
        people.forEach(function (person) {
          assert.propertyVal(person, 'name', 'Kalidia');
        });
        
        done();
      });
    });
  });

  describe('#update()', function () {
    it('should update all people records with name `Kalidia` to property rank: `Novice`.', function (done) {
      var dbinterface = new DBInterface();
      dbinterface.setCollection('sample');
      
      dbinterface.update({'rank': 'Novice'}, {'name': 'Kalidia'}, function (err, result) {
        if (err) return done(err);
        assert.equal(result.ok, 1, 'record updated');
        assert.isAtLeast(result.n, 1, 'only one record updated');
        done();
      });
    });

    it('should update the newly inserted person record in the people collection.', function (done) {
      person.name = "Cherlton";
      person.position = "Developer";
      var dbinterface = new DBInterface();
      dbinterface.setCollection('sample');
      
      dbinterface.update(person, function (err, result) {
        if (err) return done(err);
        assert.equal(result.ok, 1, 'record updated');
        assert.equal(result.n, 1, 'only one record updated');
        done();
      });
    });
  });

  describe('#remove()', function () {
    it('should remove all people records with name `Kalidia`.', function (done) {
      var dbinterface = new DBInterface();
      dbinterface.setCollection('sample');
      
      dbinterface.remove({'name': 'Kalidia'}, done);
    });

    it('should remove the newly inserted person record.', function (done) {
      var dbinterface = new DBInterface();
      dbinterface.setCollection('sample');
      
      dbinterface.remove(person, done);
    });

    it('should remove all person records.', function (done) {
      var dbinterface = new DBInterface();
      dbinterface.setCollection('sample');
      
      dbinterface.remove(done);
    });
  });
});

/*
describe('Mongo', function (){
  describe('#create()', function (){

    Mongo.create('Classifieds', 'mongodb://localhost/triniclassifieds');
    
    it('should add the property `Classifieds` as a function to the Mongo object.', function (){
      assert.property(Mongo, alias, 'Property `Classifieds` was added!');
      assert.isFunction(Mongo.Classifieds);
    })

    it('should make avaliable the #insert() function', function (){
      assert.isFunction(Mongo.Classifieds().insert, 'Insert function avaliable.')
    });

    it('should make avaliable the #find() function', function (){
      assert.isFunction(Mongo.Classifieds().find, 'Find function avaliable.')
    });

    it('should make avaliable the #update() function', function (){
      assert.isFunction(Mongo.Classifieds().update, 'Update function avaliable.')
    });

    it('should make avaliable the #remove() function', function (){
      assert.isFunction(Mongo.Classifieds().remove, 'Remove function avaliable.')
    });

  });

  describe('Mongo.' + alias, function () {
    describe('#insert()', function () {
      it('should add person object to the People collection.', function (done) {
        Mongo.Classifieds('People').insert(person, function (err, result) {
          assert.isNull(err, 'there was no error');
          assert.isNotNull(result, 'there was no error');
          assert.equal(1, result.result.ok);
          assert.equal(1, result.ops.length, 'singel person record added.');
          done();
        });
      });
    });

    describe('#find()', function() {
      it('should find all people records.', function (done){
        Mongo.Classifieds.find('People', function (err, result) {
          if(err) return done(err);
          assert.isAtLeast(result.length, 1, 'there is at least one person record returned.');
          done();
        });
      });

      it('should find people records with the name `Kalidia`.', function (done) {
        Mongo.Classifieds.find('People', {'name': 'Kalidia'}, function (err, result) {
          if(err) return done(err);
          assert.isAtLeast(result.length, 1, 'there is at least one person record returned.');
          done();
        });
      });
    });

    describe('#update()', function () {
      it('should update all people records with name `Kalidia` to property rank: `Novice`.', function (done) {
        Mongo.Classifieds.update('People', {'name': 'Kalidia'}, {'rank': 'Novice'}, done);
      });

      it('should update the newly inserted person record in the people collection.', function (done) {
        person.name = "Cherlton";
        person.position = "Developer";
        Mongo.Classifieds.update('People', person, done);
      });
    });

    describe('#remove()', function () {
      it('should remove all people records with name `Kalidia`.', function (done) {
        Mongo.Classifieds.remove('People', {'name': 'Kalidia'}, done);
      });

      it('should remove the newly inserted person record.', function (done) {
        Mongo.Classifieds.remove('People', person, done);
      });

      it('should remove all person records.', function (done) {
        Mongo.Classifieds.remove('People', done);
      });
    }); 
  }); 
});
*/