var Mongo = require('./');
var assert = require('chai').assert;

var db = 'mongodb://localhost/triniclassifieds'
var alias = 'Classifieds';

var person = {
  name: 'Kalidia', 
  position: 'Cow Mechanic', 
  rank: '...'
};

describe('Mongo', function (){
  describe('#create()', function (){

    Mongo.create(alias, db);
    
    it('should add the property `' + alias + '` to the Mongo object.', function (){
      assert.property(Mongo, alias, 'Property `' + alias + '` was added!');
    })

    it('should make avaliable the #insert() function', function (){
      assert.isFunction(Mongo[alias].insert, 'Insert function avaliable.')
    });

    it('should make avaliable the #find() function', function (){
      assert.isFunction(Mongo[alias].find, 'Find function avaliable.')
    });

    it('should make avaliable the #update() function', function (){
      assert.isFunction(Mongo[alias].update, 'Update function avaliable.')
    });

    it('should make avaliable the #remove() function', function (){
      assert.isFunction(Mongo[alias].remove, 'Remove function avaliable.')
    });

  });

  describe('Mongo.' + alias, function () {
    describe('#insert()', function () {
      it('should add person object to the People collection.', function (done) {
        Mongo.Classifieds.insert('People', person, function (err, result) {
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
