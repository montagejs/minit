/* globals self, importScripts, console, mocha:true */

// TODO WHY?
self.global = self;
delete self.global;

var node_modules_path = '../../../node_modules';
importScripts(node_modules_path + '/mocha/mocha.js');
importScripts(node_modules_path + '/chai/chai.js');
importScripts(node_modules_path + '/chai-http/dist/chai-http.js');
importScripts(node_modules_path + '/socket.io-client/dist/socket.io.js');

// Configure Test ENV
chai.use(chaiHttp);
// Export Global
global = eval("this");
global.chai = chai;
global.should = chai.should();
global.expect = chai.expect;
global.io = io;

function MyReporter(runner) {
  var passes = 0;
  var failures = 0;

  runner.on('pass', function(test){
    passes++;
    console.log('pass: %s', test.fullTitle());
  });

  runner.on('fail', function(test, err){
    failures++;
    console.log('fail: %s -- error: %s', test.fullTitle(), err.message);
  });

  runner.on('end', function(){
    console.log('end: %d/%d', passes, passes + failures);
  });
}

mocha.setup({
  allowUncaught: true,
  ui: 'bdd',
  slow: 150,
  timeout: 15000,
  bail: false,
  reporter: MyReporter,
  ignoreLeaks: false
});

importScripts('./spec/{{name}}-service-spec');
importScripts('./spec/{{name}}-service-ws-spec');

mocha.run();

