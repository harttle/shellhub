const request = require('supertest');
const server = require('../src/server.js');
const chai = require('chai')
const expect = chai.expect
const Config = require('../src/config.js');
const fs = require('fs');
const path = require('path');
const mock = require('mock-fs');

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

    it('should pass query as variables into bash', function() {
        return request(app)
            .get('/echo/word?word=WORD')
            .expect(200)
            .expect(/before WORD after/);
    });

    it('should generate loader', function() {
        var ret = server.loader('echo', {})
        expect(ret).to.equal('( echo ) 2>&1')
    });

    it('should generate loader according to query', function() {
        var ret = server.loader('echo', {foo: 'bar'})
        expect(ret).to.equal('export foo=bar;( echo ) 2>&1')
    });

    it('should skip non work characters in query', function() {
        var ret = server.loader('echo', {foo: '-bar', bar: 'baz'})
        expect(ret).to.equal('export foo=-bar;export bar=baz;( echo ) 2>&1')
    });

    it('should capture child outputs', function() {
        return request(app)
            .get('/spawn')
            .expect(200)
            .expect(/spawning child process\nhello world/);
    });

    it('should update on every request', function() {
        var cfgContent = fs.readFileSync(config.path, {encoding: 'utf-8'});
        var mockObj = {};
        mockObj[config.path] = cfgContent.replace('hello-world.sh', 'fuck-world.sh');
        mock(mockObj);
        return request(app)
            .get('/hello/world')
            .expect(200)
            .expect(/fuck world/)
            .then(() => mock.restore());
    });
});
