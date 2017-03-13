var request = require('supertest');
var server = require('../src/server.js');
var Config = require('../src/config.js');

describe('server', function() {
    var config = Config.load('fixtures/shellhubrc.json');
    var app = server.mkServer(config);

    it('should respond 404 for url not registered', function() {
        return request(app).get('/foo').expect(404);
    });

    it('should respond with text/plain', function() {
        return request(app)
            .get('/hello/world')
            .expect(200)
            .expect('content-type', 'text/plain');
    });

    it('should respond with stdout', function() {
        return request(app)
            .get('/hello/world')
            .expect(200)
            .expect(/hello world/);
    });

    it('should respond with stderr', function() {
        return request(app)
            .get('/with/error')
            .expect(200)
            .expect(/first line\nsecond line\nthird line/);
    });

    it('should capture child outputs', function() {
        return request(app)
            .get('/spawn')
            .expect(200)
            .expect(/spawning child process\nhello world/);
    });
});
