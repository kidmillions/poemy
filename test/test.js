var expect = require('expect.js'),
    request = require('superagent'),
    server = require('../server'),
    config = require('../config'),
    http = require('http'),
    dbConnect = require('../connectDatabase');

describe('The Poemy Server', function () {
    
    before(function () {
        //dbConnect( config.databaseUrl );
        //server.listen( config.port, console.log('server connected at ' + config.port ));
    });

    after(function () {
        //server.close();
    });

    //use apiPath such as /api/peoms, make sure to include '/' in front
    function testForApiConnections (apiPath, code) {
        it('should return 200 when GET to '+apiPath , function (done) {
            http.get('http://localhost:' + config.port + apiPath, function (res) {
                expect(res).to.exist;
                expect(res.status).to.equal(code);
                done();
            });
        });
    } 

    testForApiConnections('/', 200);
    testForApiConnections('/api/poems', 200);
    testForApiConnections('/api/random_poem', 200);
    testForApiConnections('/api/poem/id', 404);

});
