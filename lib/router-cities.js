var express = require('express');
var router = express.Router();
var httpError = require('./http-error');

router.get('/', function(request, response, next){
    response.locals.database.readCities(function(error, cities){
        if (error){
            next(error);
        } else {
            response.json(cities);
        }
    });
});

router.get('/:id', function(request, response, next){
    var ids = request.params.id.split(',');
    response.locals.database.readCities(ids, function(error, cities){
        if (error){
            next(error);
        } else if (cities.length == 0){
            next(httpError(404));
        } else if (cities.length == 1){
            response.json(cities[0]);
        } else {
            response.json(cities);
        }
    });
});

router.post('/', function(request, response, next){
    if (!request.body){
        next(httpError(400));
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
        next(httpError(400));
    } else {
        response.locals.database.createCities(request.body, function(error, results){
            if (error){
                next(error);
            } else {
                response.json(results);
            }
        })
    }
});

router.post('/:id', function(request, response, next){
    if (!request.body.code && !request.body.name){
        next(httpError(400));
    } else {
        var city = {
            id : request.params.id,
            code : request.body.code,
            name : request.body.name
        };
        response.locals.database.updateCity(city, function(error, results){
            if (error){
                next(error);
            } else {
                response.status(results.updated == 0 ? 404 : 200).json(results);
            }
        });
    }
});

router.delete('/:id', function(request, response, next){
    var ids = request.params.id.split(',');
    response.locals.database.deleteCities(ids, function(error, results){
        if (error){
            next(error);
        } else {
            response.status(results.deleted == 0 ? 404 : 200).json(results);
        }
    });
});

module.exports = router;
