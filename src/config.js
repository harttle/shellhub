const path = require('path');
const log = require('../src/logger.js')();
const fs = require('fs');
const _ = require('lodash');

var configDir;

function load(file) {
    var configPath = path.resolve(process.cwd(), file || 'shellhubrc.json');
    log('using config file: ' + configPath);

    var config = require(configPath) || {};
    configDir = path.dirname(configPath);
    config.path = configPath;

    if (config.stack === undefined) {
        config.stack = true;
    }
    if (config.host === undefined) {
        config.host = 'localhost';
    }
    if (config.port === undefined) {
        config.host = 8080;
    }

    config.scripts = parseScripts(config);
    config.reload = function() {
        reloadScripts(config);
    };
    return config;
}

function reloadScripts(config){
    var currStr = fs.readFileSync(config.path, {encoding: 'utf-8'});
    var currJSON = JSON.parse(currStr);
    config.scripts = parseScripts(currJSON);
    log('scripts configuration reloaded.');
}

function parseScripts(currJSON){
    var scripts = currJSON.scripts || {};
    _.forOwn(scripts, function(descriptor, key) {
        descriptor.cwd = path.resolve(configDir, descriptor.cwd);
        scripts[key] = descriptor;
    });
    return scripts;
}

exports.load = load;
