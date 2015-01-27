var info = function(request, response, next){
    response.json({
        request: {
            from_ip: request.ip,
            method : request.method,
            protocol : request.protocol,
            hostname : request.hostname,
            url : request.url,
            headers : request.headers,
            params : request.params,
            query : request.query,
            body : request.body
        },
        response : {
            status : response.statusCode,
            user : response.locals.user
        }
    });
};

module.exports = info;
