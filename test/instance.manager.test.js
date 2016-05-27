var assert = require('chai').assert;
var db = require('../');

var options = {
    host: 'localhost',
    port: 27017,
    db: 'triniclassifieds',
    instance: 'TC'
}

describe('InstanceManager', function () {
	it('should have a `create` function.', function () {
		assert.isFunction(db.create);
	});

	describe('#create()', function (){
		it('should create a new interface based on the options passed, attached to InstanceManager object.', function (){
			db.create(options);
			assert.isNotNull(db[options.instance]);
		});
	});

	describe('Instance', function () {
		it('should throw error when no collection is specified.', function (){
			assert.throws(db.TC.using, Error);
		});

		it('should expose crud operations - insert, find, update, remove.', function (){
			var TC = db.TC;
			assert.isFunction(TC.using('people').insert);
			assert.isFunction(TC.using('people').find);
			assert.isFunction(TC.using('people').update);
			assert.isFunction(TC.using('people').remove);
		});
	})
});

