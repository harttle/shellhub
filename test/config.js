const chai = require("chai");
const expect = chai.expect;
const Config = require('../src/config.js');

describe('config', function() {
    var config;
    before(function() {
        config = Config.load('fixtures/shellhubrc.json');
    });
    it('should load json as object', function() {
        expect(config).to.be.an('object');
    });
    it('should load keys', function() {
        expect(config.port).to.equal(3333);
        expect(config.scripts).to.be.an('object');
    });
    it('should resolve cwd based to current work directory', function() {
        expect(config.scripts['/hello/world'].cwd).to.match(/^\/.+\/fixtures$/);
        expect(config.scripts['/deep/cwd'].cwd).to.match(/^\/.+\/fixtures\/foo\/bar$/);
    });
});
