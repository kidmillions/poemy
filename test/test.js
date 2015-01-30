var expect = require('expect.js'),
    request = require('superagent'),
    server = require('../server'),
    config = require('../config');

describe('The Poemy Server', function () {
    
    before(function () {
        server.listen(config.port);
    })

    after(function () {
        server.close();
    })

    //use apiPath such as /api/peoms, make sure to include '/' in front
    function testForApiConnections (apiPath) {
        it('should return 200 when GET to '+apiPath , function (done) {
            request.get('localhost:' + config.port + apiPath).end(function (res) {
                expect(res).to.exist();
                expect(res.status).to.equal(200);
                done();
            });
        });
    } 

    testForApiConnections('/');
    testForApiConnections('/api/poems');
    testForApiConnections('/api/random_poem');
    testForApiConnections('/api/poem/id');

});
