#! /usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const mkServer = require('../src/server.js').mkServer;
const log = require('../src/logger.js')();
const Config = require('../src/config.js');

program
    .version(pkg.version)
    .option('-c, --conf [path]', 'validator configuration file [rules.json]')
    .parse(process.argv);

var config = Config.load(program['conf']);

var server = mkServer(config);
server.listen(config.port, config.host, function() {
    log('listening at ' + config.host + ':' + config.port);
});
