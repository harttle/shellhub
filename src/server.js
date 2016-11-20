var http = require('http');
var exec = require('child_process').exec;
var url = require('url');
var logger = require('./logger.js');

var scripts = {};

function controller(req, res) {
    var log = logger();

    var pathname = url.parse(req.url).pathname;
    writeAndLog('PATH: ' + pathname);

    var entry = scripts[pathname];
    if (!entry) {
        return res.end('path ' + pathname + ' not registered');
    }

    writeAndLog('CWD: ' + entry.cwd);
    writeAndLog('CMD: ' + entry.cmd);
    exec(entry.cmd + ' 2>&1', {
        cwd: entry.cwd
    }, function(error, stdout) {
        writeAndLog('\nSTDOUT:\n' + stdout);
        res.end();
    });
    function writeAndLog(str){
        res.write(str + '\n');
        log(str);
    }
}

exports.mkServer = function(config) {
    scripts = config.scripts;
    return http.createServer(controller);
};
