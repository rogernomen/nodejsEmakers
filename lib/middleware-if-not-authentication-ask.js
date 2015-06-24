var http = require('http');

// Middleware to ask for authentication credentials if there are none.
// Useful for endpoints that are meant to be used by a normal user with a browser, like a download.
// Must go before the generic authentication check.
var ifNotAuthenticationAsk = function (request, response, next){
    if (!request.headers.authorization){
        response.setHeader('WWW-Authenticate', 'Basic realm="emks.net"');
        response.status(401).send(http.STATUS_CODES[401]);
    } else {
	    next();
	}
};

module.exports = ifNotAuthenticationAsk;
