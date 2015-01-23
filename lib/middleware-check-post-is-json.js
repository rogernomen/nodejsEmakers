var httpError = require('./http-error');

var checkPostIsJSON = function(request, response, next){
    if (request.method == 'POST' && request.headers['content-type'].indexOf('application/json') == -1){
        next(httpError(415));
    } else {
        next();
    }
};

module.exports = checkPostIsJSON;
