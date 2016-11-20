var http = require('http');
var exec = require('child_process').exec;
var url = require('url');
var logger = require('./logger.js');

var config;

function controller(req, res) {
    var log = logger();

    var pathname = url.parse(req.url).pathname;
    writeAndLog('PATH: ' + pathname);

    var entry = config.scripts[pathname];
    if (!entry) {
        return res.end('path ' + pathname + ' not registered');
    }

    writeAndLog('CWD: ' + entry.cwd);
    writeAndLog('CMD: ' + entry.cmd);
    exec(entry.cmd + ' 2>&1', {
        cwd: entry.cwd
    }, function(err, stdout) {
        writeAndLog('STDOUT:');
        writeAndLog(stdout);
        if(config.stack && err){
            writeAndLog('STACK:');
            writeAndLog(err.stack);
        }
        res.end();
    });
    function writeAndLog(str){
        res.write(str + '\n');
        log(str);
    }
}

exports.mkServer = function(cfg) {
    config = cfg || {};
    if(config.stack === undefined){
        config.stack = true;
    }
    if(config.scripts === undefined){
        config.scripts = {};
    }
    if(config.host === undefined){
        config.host = 'localhost';
    }
    if(config.port === undefined){
        config.host = 8080;
    }
    
    return http.createServer(controller);
};
