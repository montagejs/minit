var request = require('supertest');
describe('loading express', function () {
  var server;
  beforeEach(function () {
    server = require('./../main');
  });
  afterEach(function () {
    
  });

  it('responds to /', function testSlash(done) { 
    request(server)
      .get('/')
      .expect(200, done);
  });

  it('responds to /api/fetchData', function testFetchData(done) {

    // TODO query

    request(server)
      .get('/api/fetchData')
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
          assert(response.body.message, 'Hello World');
          done();
      });
  });
    
  it('404 everything else', function testPath(done) {
    request(server)
      .get('/foo/bar')
      .expect(404, done);
  });
});