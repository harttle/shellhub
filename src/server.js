var http = require('http');
var spawn = require('child_process').spawn;
var url = require('url');
var logger = require('./logger.js');
var path = require('path');

var log = logger();
var config;

function controller(req, res) {
    config.reload();
    var urlObj = url.parse(req.url, true)
    var entry = config.scripts[urlObj.pathname];

    res.setHeader('content-type', 'text/plain')
    if (!entry) {
        var msg = 'path ' + urlObj.pathname + ' not registered';
        log(msg);
        res.statusCode = 404;
        res.end(msg);
        return
    }

    var msg = 'Running "' + entry.cmd + '" in ' + entry.cwd + '\n';
    msg += 'Output:\n',

    log(msg);
    res.write(msg);

    var loader = exports.loader(entry.cmd, urlObj.query)
    var proc = spawn('bash', ['-c', loader], {
        cwd: entry.cwd
    });

    proc.stdout.pipe(res);
    proc.stdout.pipe(process.stdout);
}

exports.loader = function(cmd, query){
    var r = /^\w+$/
    var vars = Object
        .keys(query)
        .map(function(key){
            var val = query[key];
            if (r.test(key) && r.test(val)) {
                return 'export ' + key + '=' + val + ';'
            } else {
                return ''
            }
        })
        .join('')
    return vars + '( ' + cmd + ' ) 2>&1'
}

exports.mkServer = function(cfg) {
    config = cfg;
    return http.createServer(controller);
};
