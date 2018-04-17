
var joey = require("joey");

const APP_PUBLIC_PATH = process.env.APP_PUBLIC_PATH || __dirname;
const APP_HOSTNAME = process.env.APP_HOSTNAME || 'localhost';
const APP_PORT = process.env.APP_PORT || '8080';

// Create App
var app = joey.log()
	.error()
	.favicon()
	.cors()
	.parseQuery();


// Load service controller
var main = require('./main');

// Route service controller
app.route(function (router) {   

    // TODO PUT
    // TODO data/:id

	router("api/data")
	    .method("GET")
	    .contentType("application/json")
	    .contentApp(function (request) {
	        return main.fetchData(request).catch(function (err) {
	            console.error(err, err.stack);
	            throw err;
	        });
	    });

	router("api/data")
	    .method("DELETE")
	    .contentType("application/json")
	    .contentApp(function (request) {
	        return main.deleteDataObject(request).catch(function (err) {
	            console.error(err, err.stack);
	            throw err;
	        });
	    });

	router("api/data")
	    .method("POST") 
	    .contentType("application/json")
	    .contentApp(function (request) {
	        return main.saveDataObject(request).catch(function (err) {
	            console.error(err, err.stack);
	            throw err;
	        });
	    });
});

// Serve statics
app.directoryIndex()
	.fileTree(APP_PUBLIC_PATH);

// Serve app
app.listen(APP_PORT)
	.then(function () {
	    console.log(`Listening on ${APP_HOSTNAME}:${APP_PORT}`);
	})
	.done();

// Return app for composition
module.exports = app;