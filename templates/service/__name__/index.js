/* jshint node: true */
'use strict';


// [START main_body]
var pkg = require('./package.json'),
    semver = require('semver');

if(!semver.satisfies(process.version, pkg.engines.node)) {
  // Not sure if throw or process.exit is best.
  throw new Error('Requires a node version matching ' + pkg.engines.node);
}

// [START main_body]
process.title = pkg.name;

// TODO work in progress
// Will use minit template mustache to have param to choose joey vs express
const USE_JOEY = process.env.USE_JOEY;
var app = USE_JOEY ? require('./joey') : require('./express');

// Expose app
module.exports = app; // for testing
// [END main_body]
