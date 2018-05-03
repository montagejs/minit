/* jshint node: true */
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var io = require('socket.io-client');

// Configure Test ENV
var global = eval("this");
chai.use(chaiHttp);
// Export Global
global.chai = chai;
global.should = chai.should();
global.expect = chai.expect;
global.io = io;

require('./spec/{{name}}-service-spec');
require('./spec/{{name}}-service-ws-spec');