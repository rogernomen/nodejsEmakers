var express = require('express');
var router = express.Router();
var http = require('http');

router.get('/:id', function(request, response, next){
	// Get id's param
    var ids = request.params.id.split(',');
    
    // Check consistency: id's must be integers
    var consistency = true;
    for (var i = 0; i < ids.length; i++){
    	if(!(ids[i] % 1 === 0)) consistency = false;
    }
    
    // Response Bad Request if no consistency
    if(!consistency){
	    response.status(400).json({error : http.STATUS_CODES[400]});
    }
    
    // Read routes
    response.locals.database.readDrivers(ids, function(error, drivers){
        if(error){
            response.status(500).json({error : error.message});
        }else{
            response.json(drivers);
        }
    });
});

router.get('/:id/avatar', function(request, response, next){
	// Get id's param
    var ids = request.params.id.split(',');
    
    // Check consistency: id's must be integers
    var consistency = true;
    for (var i = 0; i < ids.length; i++){
    	if(!(ids[i] % 1 === 0)) consistency = false;
    }
    
    // Response Bad Request if no consistency
    if(!consistency){
	    response.status(400).json({error : http.STATUS_CODES[400]});
    }
    
    // Read routes
    response.locals.database.readAvatarDriver(ids, function(error, avatar){
        if(error){
            response.status(500).json({error : error.message});
        }else{
            response.json(avatar);
        }
    });
});

router.get('/:id/unfinishedRoutes', function(request, response, next){
	// Get id's param
    var ids = request.params.id.split(',');
    
    // Check consistency: id's must be integers
    var consistency = true;
    for (var i = 0; i < ids.length; i++){
    	if(!(ids[i] % 1 === 0)) consistency = false;
    }
    
    // Response Bad Request if no consistency
    if(!consistency){
	    response.status(400).json({error : http.STATUS_CODES[400]});
    }
    
    // Read routes
    response.locals.database.readUnfinishedRoutes(ids, function(error, routes){
        if(error){
            response.status(500).json({error : error.message});
        }else{
            response.json(routes);
        }
    });
});

router.post('/login', function(request, response, next){
	if (!request.body.hash_dispositivo){
        response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
        response.locals.database.updateDriverLogin(request, response, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

module.exports = router;
