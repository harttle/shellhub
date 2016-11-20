#! /usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const mkServer = require('../src/server.js').mkServer;
const path = require('path');
const log = require('../src/logger.js')();

program
    .version(pkg.version)
    .option('-c, --conf [path]', 'validator configuration file [rules.json]')
    .parse(process.argv);

var configPath = path.resolve(process.cwd(), program['conf'] || 'shellhubrc.json');
log('using config file: ' + configPath);
var config = require(configPath);

var server = mkServer(config);
server.listen(config.port, config.host, function() {
    log('listening at ' + config.host + ':' + config.port);
});
