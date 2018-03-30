
const APP_PUBLIC_PATH = process.env.APP_PUBLIC_PATH || './public';
const APP_HOSTNAME = process.env.APP_HOSTNAME || 'localhost';
const APP_PORT = process.env.APP_PORT || '8080';

var joey = require("joey");

// Create App
var app = joey.log()
	.error()
	.favicon()
	.parseQuery()
	.route(function ($) {
	    $("")
	    .method("GET")
	    .contentType("text/plain")
	    .content("Hello, World!")
	})

// Add middleware
require('./middleware')(app);

// Serve app
app.listen(APP_PORT)
	.then(function () {
	    console.log(`Listening on https://${APP_HOSTNAME}:${APP_PORT}`)
	})
	.done();

// Return app for composition
module.exports = app;