var http = require('http');
var exec = require('child_process').exec;
var url = require('url');
var fs = require('fs');
var path = require('path');

var rc = path.resolve(process.cwd(), 'shellhubrc.json');
var config = require(rc);
 
var server = http.createServer(function (req, res) {
    var pathname = url.parse(req.url).pathname;
    var entry = config.scripts[pathname];
    if(!entry){
        var msg = `path ${pathname} not registered`;
        return internalError(res, msg);
    }

    exec(entry.cmd, {
        cwd: entry.cwd
    }, function(error, stdout, stderr) {
        if(error){
            return internalError(res, error);
        }
        var msg = buildResult(stdout, stderr);
        return ok(res, msg);
    });
    
});

function buildResult(stdout, stderr){
    return [
        '<h2>STDOUT</h2>',
        buildPre(stdout),
        '<h2>STDERR</h2>',
        buildPre(stderr)
    ].join('\n');
}

function buildPre(code){
    return [
        '<pre><code>',
        code,
        '</code></pre>',
    ].join('\n');
}

function ok(res, msg){
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    return res.end(msg);
}

function internalError(res, msg){
    if(msg instanceof Error){
        msg = buildPre(msg.stack);
    }
    res.writeHead(500, {
        'Content-Type': 'text/html'
    });
    return res.end(msg);
}


server.listen(config.port, config.host, function(){
    console.log(`shellhub listening at ${config.host}:${config.port}`);
});

