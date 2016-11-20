const chai = require("chai");
const expect = chai.expect;
const logger = require('../src/logger.js');
const sinon = require("sinon");
chai.use(require("sinon-chai"));

describe('logger', function() {
    var log;
    beforeEach(function() {
        logger.reset();
        log = logger();
        var olog = console.log;
        sinon.stub(console, 'log', function() {
            return olog.apply(console, arguments);
        });
    });
    afterEach(function() {
        console.log.restore();
    });
    it('should log out the given string', function() {
        log('foo');
        expect(console.log.args[0][0]).to.match(/foo$/);
    });
    it('should log out current date time', function() {
        log('foo');
        var exp = /\[[\dT:Z\.-]+\]/;
        expect(console.log.args[0][0]).to.match(exp);
    });
    it('should log out date time in each line', function() {
        log('foo\nbar');
        var foo = /\[[\dT:Z\.-]+\]\[001\] foo/;
        var bar = /\[[\dT:Z\.-]+\]\[001\] bar/;
        expect(console.log.args[0][0]).to.match(foo);
        expect(console.log.args[0][0]).to.match(bar);
    });
    it('should increase traceID every time logger() called', function(){
        log('foo');
        log = logger();
        log('foo');
        expect(console.log.args[0][0]).to.contain('[001]');
        expect(console.log.args[1][0]).to.contain('[002]');
    });
    it('should not increase traceID every time log() called', function(){
        log('foo');
        log('foo');
        expect(console.log.args[0][0]).to.contain('[001]');
        expect(console.log.args[1][0]).to.contain('[001]');
    });
    it('should maintain multiple traceID in the same time', function(){
        var log2 = logger();
        log2('foo');
        log('foo');
        expect(console.log.args[0][0]).to.contain('[002]');
        expect(console.log.args[1][0]).to.contain('[001]');
    });
});
