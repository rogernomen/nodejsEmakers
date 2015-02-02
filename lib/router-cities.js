var express = require('express');
var router = express.Router();
var http = require('http');

router.get('/', function(request, response, next){
    response.locals.database.readCities(function(error, cities){
        if (error){
            response.status(500).json({error : error.message});
        } else {
            response.json(cities);
        }
    });
});

router.get('/:id', function(request, response, next){
    var ids = request.params.id.split(',');
    response.locals.database.readCities(ids, function(error, cities){
        if (error){
            response.status(500).json({error : error.message});
        } else {
            response.json(cities);
        }
    });
});

router.post('/', function(request, response, next){
    if (!request.body){
        response.status(400).json({error : http.STATUS_CODES[400]});
        return;
    }
    if (Object.prototype.toString.call(request.body) !== '[object Array]'){
        request.body = [request.body];
    }
    var missingId = false;
    for (var i = 0; i < request.body.length; i++){
        if (!request.body[i].id){
            missingId = true;
            break;
        }
    }
    if (missingId){
        response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
        response.locals.database.createCities(request.body, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id', function(request, response, next){
    if (!request.body.code && !request.body.name){
        response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
        var city = {
            id : request.params.id,
            code : request.body.code,
            name : request.body.name
        };
        response.locals.database.updateCity(city, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.put('/:id', function(request, response, next){
    if (!request.body.code && !request.body.name){
        response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
        var city = {
            id : request.params.id,
            code : request.body.code,
            name : request.body.name
        };
        response.locals.database.replaceCity(city, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.delete('/:id', function(request, response, next){
    var ids = request.params.id.split(',');
    response.locals.database.deleteCities(ids, function(error, results){
        if (error){
            response.status(500).json({error : error.message});
        } else {
            response.json(results);
        }
    });
});

module.exports = router;
