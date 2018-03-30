var request = require("joey").redirectTrap(20).client();

describe('loading express', function () {
  
  var server,
    apiURL = 'http://localhost:8080/api';
  
  beforeEach(function () {
    server = require('./../main');
  });

  afterEach(function () {
    // TODO close
  });

  it('responds to GET /fetchData', function testFetchData(done) {
    request({
        url: apiURL + '/fetchData',
        method: 'GET'
    }).then(function (response) {
          var ok = response.status >= 200 && response.status < 400;
          if (!ok) {
              throw new Error('API responded with a status code: ' + response.status);
          } else {
            done();
          }
      });
  });

  it('responds to POST /fetchData', function testFetchData(done) {
      var body = JSON.stringify({
          name: 'foo'
      });

      var headers = {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body, 'utf8')
      };
      
      request({
          url: apiURL + '/fetchData',
          charset: 'UTF-8',
          method: 'POST',
          headers: headers,
          body: [body]
      }).then(function (response) {
          var ok = response.status >= 200 && response.status < 400;
          // TODO check response
          if (!ok) {
              throw new Error('API responded with a status code: ' + response.status);
          } else {
            done();
          }
      });
  });
    
  it('404 everything else', function testPath(done) {
      request({
          url: apiURL + '/foo/bar',
          method: 'GET'
      }).then(function (response) {
          var ok = response.status === 404;
          if (!ok) {
              throw new Error('API responded with a status code: ' + response.status);
          } else {
            done();
          }
      });
  });
});