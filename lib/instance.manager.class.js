(function (DBInterface, _) {
	var manager = { };

	manager.create = function (options) {
		var instance = options.instance ? options.instance : options.db;

		if (!instance) 
			throw new Error('Unusable options passed - Unable to create interface without name.');

		if (manager.hasOwnProperty(instance))
			throw new Error('An interface with the name `' + instance + '` has already been defined');

		var interface = new DBInterface();
		this[instance] = _.bind(interface.using, interface);
	};

	module.exports = manager;
})(require('./dbinterface.class'), require('lodash'));