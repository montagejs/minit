
var APP_TEST_URL = null;

if (typeof process !== 'undefined') {
  APP_TEST_URL = process.env.APP_TEST_URL;
}

// Default value
APP_TEST_URL = APP_TEST_URL || 'http://localhost:8080';

describe('{{exportedName}} HTTP API', () => {
  beforeEach((done) => {
     done();        
  });
  describe('/GET {{name}}', () => {
      it('it should GET all the {{name}}s', (done) => {
        chai.request(APP_TEST_URL)
            .get('/api/data')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('root');
                expect(res.body.root).to.be.a('object');
                expect(res.body.root).to.have.property('value');
                expect(res.body).to.have.property('{{name}}');
                expect(res.body.{{name}}).to.be.a('object');
                expect(res.body.{{name}}).to.have.property('prototype');
                expect(res.body.{{name}}).to.have.property('prototype');
                expect(res.body.{{name}}).to.have.property('values');
              done();
            });
      });
  });
  /*
  * Test the /POST route
  */
  describe('/POST {{name}}', () => {
      it('it should not POST a {{name}} without pages field', (done) => {
        var {{exportedName}} = {
        };
        chai.request(APP_TEST_URL)
            .post('/api/data')
            .send({{exportedName}})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('root');
                expect(res.body.root).to.be.a('object');
                expect(res.body.root).to.have.property('value');
              done();
            });
      });
  });
  /*
  * Test the /POST route
  */
  describe('/DELETE {{name}}', () => {
      it('it should not DELETE a {{name}} without pages field', (done) => {
        var {{exportedName}} = {
        };
        chai.request(APP_TEST_URL)
            .delete('/api/data')
            .send({{exportedName}})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
              done();
            });
      });
  });
});