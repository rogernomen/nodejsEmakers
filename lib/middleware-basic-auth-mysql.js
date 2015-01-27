var http = require('http');
var basicAuth = require('basic-auth');

var authenticator = function(request, response, next){
    var credentials = basicAuth(request);
    if (!credentials || !credentials.name || !credentials.pass){
        response.status(401).json({error : http.STATUS_CODES[401]});
    } else {
        response.locals.database.authenticate(credentials.name, credentials.pass, function(error, user){
            if (error){
                response.status(500).json({error : error.message});
            } else if (!user){
                response.status(401).json({error : http.STATUS_CODES[401]});
            } else {
                response.locals.user = user;
                next();
            }
        });
    }
};

module.exports = authenticator;
