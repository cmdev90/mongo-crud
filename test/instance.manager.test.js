var assert = require('chai').assert;
var db = require('../');

var options = {
    host: 'localhost',
    port: 27017,
    db: 'triniclassifieds',
    instance: 'TC'
}

describe('InstanceManager', function () {
	this.slow(25);

	it('should have a `create` function.', function () {
		assert.isFunction(db.create);
	});

	describe('#create()', function (){
		it('should create a new interface based on the options passed, attached to InstanceManager object.', function (){
			db.create(options);
			assert.isNotNull(db.TC);
			assert.isFunction(db.TC);
		});
	});

	describe('Instance', function () {
		it('should throw error when no collection is specified.', function (){
			assert.throws(db.TC, Error);
		});

		it('should expose crud operations - insert, find, update, remove.', function (){
			assert.isFunction(db.TC('people').insert);
			assert.isFunction(db.TC('people').find);
			assert.isFunction(db.TC('people').update);
			assert.isFunction(db.TC('people').remove);
		});
	})
});

