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
	    return;
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
	    return;
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
	    return;
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

router.get('/:id/notify', function(request, response, next){
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
	    return;
    }

    // Read routes registered device ids
    response.locals.database.readDriversDeviceIds(ids, function(error, deviceIds){
        if(error){
            response.status(500).json({error : error.message});
        }else if(deviceIds.length == 0){
        	response.json({status: '0 notifications sent'});
        }else{
        	// The server API key created for the project on the Google Developer Console
			var serverAPIKey = 'AIzaSyDSdO8kHEPQYyjojIVtAO_0QqK4Yl7quf8';
			
			// All pending messages with the same collapse key will be joined into one
			var collapseKey = 'syncRoutesAndParcels';
			
			// Discard message after 24h
			var timeToLive = 86400;
			
			var gcm = require('node-gcm');
			
			var message = new gcm.Message({
				collapseKey : collapseKey,
				timeToLive  : timeToLive
			});
		
			var sender = gcm.Sender(serverAPIKey);
			sender.send(message, deviceIds, function(error, result){
				if (error){
		            response.status(500).json({error : error.message});
				} else {
		        	response.json({status: deviceIds.length + ' notifications sent'});
				}
			});
        }
    });			
});

module.exports = router;
