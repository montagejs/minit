var APP_TEST_URL = null;

if (typeof process !== 'undefined') {
  APP_TEST_URL = process.env.APP_TEST_URL
}

// Default value
APP_TEST_URL = APP_TEST_URL || 'http://localhost:8080';

describe('{{exportedName}} WS API', () => {
    var socket;
    beforeEach(function(done) {
        // Setup
        socket = io.connect(APP_TEST_URL, {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true
        });
        socket.on('connect', function() {
            //console.log('worked...');
            done();
        });
        socket.on('disconnect', function() {
            //console.log('disconnected...');
        })
    });
    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            //console.log('disconnecting...');
            socket.disconnect();
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });
    describe('fetchData', () => {
        it('it should GET all the {{name}}s', (done) => {
            socket.once('fetchData', function(res) {     
                expect(res).to.be.a('object');
                expect(res).to.have.property('root');
                expect(res.root).to.be.a('object');
                expect(res.root).to.have.property('value');
                done();
            });
            socket.emit('fetchData');
        });
    });
});