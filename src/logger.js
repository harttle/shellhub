var _id = 0;
var max = 100;

function logger() {
    var id = _id = (_id + 1) % max;

    function log(msg) {
        msg = msg + '';
        msg = msg.split('\n').map(function(str) {
            return dateString() + '[' + padding(id) + '] ' + str;
        }).join('\n');
        console.log(msg);
    }

    return log;
}

function dateString() {
    var now = new Date();
    return '[' + now.toISOString() + ']';
}

function padding(i) {
    var len = (i + '').length;
    return '000'.substr(0, 3 - len) + i;
}

logger.reset = function(){
    _id = 0;
}

module.exports = logger;
