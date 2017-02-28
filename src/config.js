const path = require('path');
const log = require('../src/logger.js')();
const _ = require('lodash');

function load(file) {
    var configPath = path.resolve(process.cwd(), file || 'shellhubrc.json');
    log('using config file: ' + configPath);

    var config = require(configPath) || {};
    config.path = configPath;

    if (config.stack === undefined) {
        config.stack = true;
    }
    if (config.scripts === undefined) {
        config.scripts = {};
    }
    if (config.host === undefined) {
        config.host = 'localhost';
    }
    if (config.port === undefined) {
        config.host = 8080;
    }

    var configDir = path.dirname(configPath);
    _.forOwn(config.scripts, function(descriptor) {
        descriptor.cwd = path.resolve(configDir, descriptor.cwd);
    });

    return config;
}

exports.load = load;
