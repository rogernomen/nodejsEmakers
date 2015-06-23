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
	
    // Read agencies data
    response.locals.database.readAgenciesData(ids, function(error, agenciesData){
        if(error){
            response.status(500).json({error : error.message});
        }else{
            response.json(agenciesData);
        }
    });	    
});

module.exports = router;
