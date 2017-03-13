var http = require('http');
var spawn = require('child_process').spawn;
var url = require('url');
var logger = require('./logger.js');
var path = require('path');

var log = logger();
var config;

function controller(req, res) {
    var pathname = url.parse(req.url).pathname;
    var entry = config.scripts[pathname];

    res.setHeader('content-type', 'text/plain')
    if (!entry) {
        var msg = 'path ' + pathname + ' not registered';
        log(msg);
        res.statusCode = 404;
        res.end(msg);
        return
    }

    var msg = 'Running "' + entry.cmd + '" in ' + entry.cwd + '\n';
    msg += 'Output:\n',

    log(msg);
    res.write(msg);

    var proc = spawn('bash', ['-c', '( ' + entry.cmd + ' ) 2>&1'], {
        cwd: entry.cwd
    });

    proc.stdout.pipe(res);
    proc.stdout.pipe(process.stdout);
}

exports.mkServer = function(cfg) {
    config = cfg;
    return http.createServer(controller);
};
