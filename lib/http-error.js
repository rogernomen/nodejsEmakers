var http = require('http');

var httpError = function(status){
    var error = new Error(http.STATUS_CODES[status]);
    error.status = status;
    return error;
};

module.exports = httpError;
