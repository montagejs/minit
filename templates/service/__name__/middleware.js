var PATH = require("path");
var Montage = require('montage');

var mr = Montage.loadPackage(PATH.join(__dirname, "."), {
    mainPackageLocation: PATH.join(__dirname, ".")
});

var mainService;
function getMainService() {

	// Once only
	if (mainService) {
		return Promise.resolve(mainService);
	}

	// Load main service
	return mr.async("montage/data/service/data-service").then(function (module) {
        return (mainService = new module.DataService());

    // Load sub service
    }).then(function (mainService) {
    	return mr.async("logic/service/{{name}}-service").then(function (module) {
    		mainService.addChildService(new module.{{exportedName}}());
    		return mainService;
    	});
    });
}

// Note: Work in progress

module.exports = function (app) {
	app.route(function (router) {
    	// TODO move router to app (fetchData|create|delete|update)			
	    router("api/fetchData")
		    .method("GET")
		    .json()
		    .app(function () {
		    	// You need to do that after route install before .listen that 
		    	// why it's inside the app function
		    	
		    	return getMainService().then(function (mainService) {
			    	return {
				    	message: "Hello, World!"
				    };	
				    /*
				    Deserializer.defineDeserializationUnit("bindings", function (deserializer, object, bindings) {
					TypeError: Cannot read property 'defineDeserializationUnit' of undefined
					*/
		    		return Deserializer.deserialize(request.params.query, require).then(function () {
						return mainService.fetchData(dataQuery);
					}).then(function (queryResult) {
				    	return queryResult;
					});
		    	}).catch(function (err) {
		    		console.error(err, err.stack);
		    		throw err;
		    	});
		    });
	});
};