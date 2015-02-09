var express = require('express');
var router = express.Router();
var http = require('http');

router.get('/', function(request, response, next){
	
	console.log(request.query);
    
    response.locals.database.readRoutes(request.query.filter, request.query.like, request.query.sort, request.query.limit, function(error, routes){
        if (error){
            response.status(500).json({error : error.message});
        } else {
            response.json(routes);
        }
    });
});

module.exports = router;