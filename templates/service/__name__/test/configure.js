// Configure Test ENV
chai.use(chaiHttp);
// Export Global
global = eval("this");
global.chai = chai;
global.should = chai.should();
global.expect = chai.expect;
global.io = io;