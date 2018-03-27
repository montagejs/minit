require("joey")

// Montage Accelerator env
var Require = require('mr/bootstrap-node');

// Expose Env
global.XMLHttpRequest = require('xhr2');




require("joey")
.log()
.error()
.favicon()
.route(function ($) {
 
    $("")
    .method("GET")
    .contentType("text/plain")
    .content("Hello, World!")

    // TOO middleware .use(MontageService)

	// Install Montage Service
	Require.loadPackage(".").then(function (require) {

		var DataService = require("montage/data/service/data-service").DataService;
		var DataSelector require('montage/data/service/data-selector').DataSelector;
		var Criteria require('montage/core/criteria').Criteria;
		var Deserializer require('montage/core/serialization/deserializer/montage-deserializer');
		var mainService = new DataService();

		//var helloWorkService = new HelloWorkService();
		//mainService.addChildService(HelloWorkService);

	    $("fetchData")
	    .method("GET")
	    .contentType("text/html")
	    .contentApp(function (request) {

	    	module.deserialize(request.params.query, require).then(function () {
	    		return mainService.fetchData(dataQuery);
	    	}).then(function (response) {
	    		// "Hello, " + request.query.name + "!\n"
	    		// "Hello, " + request.pathInfo + "\n"
	        	return {
			        status: 200,
			        headers: {
			            "content-type": "text/plain"
			        },
			        "body": [
			            response //
			        ]
			    };
	    	}).catch(function (err) {
	    		return {
			        status: 500,
			        headers: {
			            "content-type": "text/plain"
			        },
			        "body": err.message
			    }
	    	}); 
	    });
	});
 
})
.listen(8080)
.then(function () {
    console.log("Listening on 8080")
})
.done()




