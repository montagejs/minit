var PATH = require("path");
var Montage = require('montage');

var mr;
function getMontageRequire() {
	// Once only
	if (mr) {
		return Promise.resolve(mr);
	}

	return Montage.loadPackage(PATH.join(__dirname, "."), {
	    mainPackageLocation: PATH.join(__dirname, ".")
	}).then(function (require) {
		return (mr = require);
	});
}

var mainService;
function getMainService() {
	return getMontageRequire().then(function (mr) {

		// Once only
		if (mainService) {
			return Promise.resolve(mainService);
		}

		// Load main service
		return mr.async("montage/data/service/data-service").then(function (module) {
	        return (mainService = new module.DataService());

	    // Load sub service
	    }).then(function (mainService) {
    		return mr.async("logic/model/{{name}}-model").then(function (module) {
		    	return mr.async("logic/service/{{name}}-service").then(function (module) {
		    		mainService.addChildService(new module.{{exportedName}}Service());
		    		return mainService;
		    	});
		    });
	    });
	});
}


function getDataQuery(query) {
	return getMontageRequire().then(function (mr) {
		return mr.async("montage/data/service/data-selector").then(function (module) {
		    var DataSelector = module.DataSelector;
		    return mr.async("montage/core/criteria").then(function (module) {
		        var Criteria = module.Criteria;
		        return mr.async('montage/core/serialization/deserializer/montage-deserializer').then(function (module) {
		            return module.deserialize(query, mr); 
		        });
		    });
		});	
	});
}

function createDataQuery() {
	return getMontageRequire().then(function (mr) {
		return mr.async("montage/data/service/data-selector").then(function (module) {
		    var DataSelector = module.DataSelector;
		    return mr.async("montage/core/criteria").then(function (module) {
		        var Criteria = module.Criteria;
	    		return mr.async("logic/model/{{name}}-model").then(function (module) {
		            
		            // A Default Query
		            var dataType = module.{{exportedName}};
		            var dataExpression = "name = $name";
		            var dataParameters = {
		            	name: "Dave"
		            };

		            var dataCriteria = new Criteria().initWithExpression(dataExpression, dataParameters);
		            var dataQuery  = DataSelector.withTypeAndCriteria(dataType, dataCriteria);
		     
		            return dataQuery;
		    	
		    	// Convert to serialized version
		    	}).then(function (dataQuery) {
	    			return mr.async('montage/core/serialization/serializer/montage-serializer').then(function (module) {
			            return module.serialize(dataQuery, mr); 
			        });
		    	});
    		});
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
		    .app(function (request) {
		    	// You need to do that after route install before .listen that 
		    	// why it's inside the app function
		    	return getMainService().then(function (mainService) {
		    		var queryParam = request.query.query || request.params.query;
					var dataQueryPromise = queryParam ? Promise.resolve(queryParam) : createDataQuery();
					return dataQueryPromise.then(function (query) {
						return getDataQuery(query).then(function (dataQuery) {
							return mainService.fetchData(dataQuery);
						}).then(function (queryResult) {
							return queryResult;
							// TODO return serialize?
							return mr.async('montage/core/serialization/serializer/montage-serializer').then(function (module) {
					            return JSON.parse(module.serialize(queryResult, mr)); 
					        });
						});
					});
		    	}).catch(function (err) {
		    		console.error(err, err.stack);
		    		throw err;
		    	});
		    });
	});
};