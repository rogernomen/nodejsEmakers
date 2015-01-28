var express = require('express');
var router = express.Router();
var http = require('http');

// Doesn't need the user id in the URL because it gets it from the http auth credentials.
// Receives the phone number and GCM id, sends the courier id and if the courier was updated.
router.post('/login', function(request, response, next){
    if (!request.body || !request.body.phoneNumber || !request.body.gcmDeviceId){
        response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
        response.locals.database.loginCourier(response.locals.user.id, request.body.phoneNumber, request.body.gcmDeviceId, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.get('/logout', function(request, response, next){
    response.locals.database.logoutCourier(response.locals.user.id, function(error, results){
        if (error){
            response.status(500).json({error : error.message});
        } else {
            response.json(results);
        }
    });
});

router.get('/', function(request, response, next){
    response.locals.database.readCouriers(function(error, couriers){
        if (error){
            response.status(500).json({error : error.message});
        } else {
            response.json(couriers);
        }
    });
});

router.get('/:id', function(request, response, next){
    var ids = request.params.id.split(',');
    response.locals.database.readCouriers(ids, function(error, couriers){
        if (error){
            response.status(500).json({error : error.message});
        } else {
            response.json(couriers);
        }
    });
});

module.exports = router;
