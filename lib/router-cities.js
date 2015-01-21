var express = require('express');
var router = express.Router();
var httpError = require('./http-error');

router.get('/', function(request, response, next){
    var options = {};
    if (request.query.id){
        options.id = request.query.id;
    }
    if (request.query.code){
        options.code = request.query.code;
    }
    if (request.query.name){
        options.name = request.query.name;
    }
    response.locals.database.readCities(options, function(error, cities){
        if (error){
            next(error);
        } else {
            response.json(cities);
        }
    });
});

router.get('/:id', function(request, response, next){
    var options = {
        id : request.params.id
    };
    response.locals.database.readCities(options, function(error, cities){
        if (error){
            next(error);
        } else if (cities.length == 0){
            next(httpError(404));
        } else {
            response.json(cities[0]);
        }
    });
});

router.post('/', function(request, response, next){
    if (!request.body.id || !request.body.code || !request.body.name){
        next(httpError(400));
    } else {
        var city = {
            id : request.body.id,
            code : request.body.code,
            name : request.body.name
        };
        response.locals.database.createCity(city, function(error, results){
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
                response.json(results);
            }
        });
    }
});

router.delete('/:id', function(request, response, next){
    response.locals.database.deleteCity({id : request.params.id}, function(error, results){
        if (error){
            next(error);
        } else {
            response.json(results);
        }
    });
});

module.exports = router;
