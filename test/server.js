const chai = require("chai");
const expect = chai.expect;
const request = require('supertest');
const server = require('../src/server.js');
const Config = require('../src/config.js');

describe('server', function() {
    var config = Config.load('fixtures/shellhubrc.json');
    var app = server.mkServer(config);

    it('should respond 404 for url not registered', function() {
        return request(app).get('/foo').expect(404);
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
});
