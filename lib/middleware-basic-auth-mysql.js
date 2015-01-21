var httpError = require('./http-error');
var basicAuth = require('basic-auth');

var authenticator = function(request, response, next){
    var credentials = basicAuth(request);
    if (!credentials || !credentials.name || !credentials.pass){
        next(httpError(401));
    } else {
        response.locals.database.authenticate(credentials.name, credentials.pass, function(error, user){
            if (error){
                next(error);
            } else if (!user){
                next(httpError(401));
            } else {
                response.locals.user = user;
                next();
            }
        });
    }
};

module.exports = authenticator;
