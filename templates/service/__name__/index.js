/* jshint node: true */
'use strict';

// [START main_body]
process.title = "{{name}}-service";

// TODO work in progress
// Will use minit template mustache to have param to choose joey vs express
const USE_JOEY = process.env.USE_JOEY;
var app = USE_JOEY ? require('./joey') : require('./express');

// Expose app
module.exports = app; // for testing
// [END main_body]
