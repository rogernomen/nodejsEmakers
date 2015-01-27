var http = require('http');

var checkPostIsJSON = function(request, response, next){
    if (request.method == 'POST' && request.headers['content-type'].indexOf('application/json') == -1){
        response.status(415).json({error : http.STATUS_CODES[415]});
    } else {
        next();
    }
};

module.exports = checkPostIsJSON;
