(function (DBInterface) {
	var manager = { };

	manager.create = function (options) {
		var instance = options.instance ? options.instance : options.db;

		if (!instance) 
			throw new Error('Unusable options passed - Unable to create interface without name.');

		if (manager.hasOwnProperty(instance))
			throw new Error('An interface with the name `' + instance + '` has already been defined');

		this[instance] = new DBInterface();
	};

	module.exports = manager;
})(require('./dbinterface.class'));