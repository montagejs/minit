process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

global.chai = chai;
global.should = chai.should();
global.expect = chai.expect;


var io = require('socket.io-client');
global.io = io;

require('./spec/{{name}}-service-spec');
require('./spec/{{name}}-service-ws-spec');