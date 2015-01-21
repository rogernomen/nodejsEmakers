var http = require('http');

var errorHandler = function(error, request, response, next){
    var status = error.code || error.status || 500;
    var message = error.message || http.STATUS_CODES[status] || http.STATUS_CODES[500];
    response.status(status).json({error : message, code : status});
};

module.exports = errorHandler;
