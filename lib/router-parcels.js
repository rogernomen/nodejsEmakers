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
    
    // Default mode = FULL
	if(typeof request.query.mode === 'undefined'){
	   request.query.mode = 'FULL';
	};
    
    // Read routes
    response.locals.database.readParcels(ids, request.query.mode, function(error, routes){
        if(error){
            response.status(500).json({error : error.message});
        }else{
            response.json(routes);
        }
    });
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
    response.locals.database.readParcelsDeviceIds(ids, function(error, deviceIds){
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

router.post('/:id/update/destinationType', function(request, response, next){
    if (!request.body.cf_tipo_destino){
        response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
        var parcel_destination = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            cf_tipo_destino : request.body.cf_tipo_destino
        };
        response.locals.database.updateDestinationType(parcel_destination, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id/update/geolocation', function(request, response, next){
    if (!request.body.lat || !request.body.lon){
        response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
    	var geo_data = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            lat : request.body.lat,
            lon : request.body.lon
        };
        response.locals.database.updateGeolocation(geo_data, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id/update/driverComments', function(request, response, next){
    var comments = {
        id : request.params.id,
        id_repartidor : request.body.id_repartidor,
        comentarios_repartidor : request.body.comentarios_repartidor
    };
    response.locals.database.updateDriverComments(comments, function(error, results){
        if (error){
            response.status(500).json({error : error.message});
        } else {
            response.json(results);
        }
    });
});

router.post('/:id/update/deliver', function(request, response, next){
    if (	!request.body.id_repartidor 		|| 
    		!request.body.cf_agencia 			|| 
    		!request.body.cf_itinerario 		|| 
    		!request.body.fecha_entrega_final 	|| 
    		!request.body.comentarios_entrega 	|| 
    		!request.body.firma 				
    ){
    	console.log(request.body);
        response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
    	var delivery_data = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            cf_agencia : request.body.cf_agencia,
            cf_itinerario : request.body.cf_itinerario,
            firma : request.body.firma,
            orden_itinerario : request.body.orden_itinerario,
            comentarios_entrega : request.body.comentarios_entrega,
            fecha_entrega_final : request.body.fecha_entrega_final,
            lat : request.body.lat,
            lon : request.body.lon
        };
        response.locals.database.updateDelivery(delivery_data, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id/update/cannotDeliver', function(request, response, next){
    if (	!request.body.id_repartidor 		|| 
    		!request.body.cf_agencia 			|| 
    		!request.body.cf_estado 			|| 
    		!request.body.fecha_entrega_final	|| 
    		!request.body.cf_itinerario
    ){
    	response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
    	// Controlamos las variables opcionales
    	var orden_itinerario;
    	if( typeof request.body.orden_itinerario == undefined ){
	    	orden_itinerario = null;
    	}else{
	    	orden_itinerario = request.body.orden_itinerario;
    	}
    	
    	var foto;
    	if( typeof request.body.foto == undefined ){
	    	foto = null;
    	}else{
	    	foto = request.body.foto;
    	}
    	
    	var cannotDelivery_data = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            cf_agencia : request.body.cf_agencia,
            cf_estado : request.body.cf_estado,
            tono_duracion : request.body.tono_duracion,
            telf_duracion : request.body.telf_duracion,
            cf_itinerario : request.body.cf_itinerario,
            foto : foto,
            orden_itinerario : orden_itinerario,
            comentarios_entrega : request.body.comentarios_entrega,
            fecha_entrega_final : request.body.fecha_entrega_final,
            horario1_inicio : request.body.horario1_inicio,
            horario1_final : request.body.horario1_final,
            horario2_inicio : request.body.horario2_inicio,
            horario2_final : request.body.horario2_final,
            lat : request.body.lat,
            lon : request.body.lon
        };
        response.locals.database.updateCannotDeliver(cannotDelivery_data, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id/update/pickup', function(request, response, next){
    if (	!request.body.id_repartidor 		|| 
    		!request.body.cf_agencia 			|| 
    		!request.body.cf_itinerario 		|| 
    		!request.body.cf_tipo_demanda 		|| 
    		!request.body.fecha_entrega_final 	|| 
    		!request.body.comentarios_entrega 	|| 
    		!request.body.firma 				
    ){
    	response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
    	// Controlamos las variables opcionales
    	var orden_itinerario;
    	if( typeof request.body.orden_itinerario == undefined ){
	    	orden_itinerario = null;
    	}else{
	    	orden_itinerario = request.body.orden_itinerario;
    	}
    	
    	// Controlamos las variables opcionales
    	var punteo;
    	if( typeof request.body.orden_itinerario == undefined ){
	    	punteo = [];
    	}else{
	    	punteo = request.body.punteo;
    	}
    
    	var pickup_data = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            cf_agencia : request.body.cf_agencia,
            cf_itinerario : request.body.cf_itinerario,
            orden_itinerario : orden_itinerario,
            firma : request.body.firma,
            cf_tipo_demanda : request.body.cf_tipo_demanda,
            punteo : punteo,
            comentarios_entrega : request.body.comentarios_entrega,
            fecha_entrega_final : request.body.fecha_entrega_final,
            lat : request.body.lat,
            lon : request.body.lon
        };
        response.locals.database.updatePickup(pickup_data, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id/update/cannotPickup', function(request, response, next){
    if (	!request.body.id_repartidor 		|| 
    		!request.body.cf_agencia 			|| 
    		!request.body.cf_estado 			|| 
    		!request.body.cf_itinerario 		|| 
    		!request.body.fecha
    ){
    	response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
    	// Controlamos las variables opcionales
    	var orden_itinerario;
    	if( typeof request.body.orden_itinerario == undefined ){
	    	orden_itinerario = null;
    	}else{
	    	orden_itinerario = request.body.orden_itinerario;
    	}
    	
    	var foto;
    	if( typeof request.body.foto == undefined ){
	    	foto = null;
    	}else{
	    	foto = request.body.foto;
    	}
    	
    	var cannotPickup_data = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            cf_agencia : request.body.cf_agencia,
            cf_estado : request.body.cf_estado,
            tono_duracion : request.body.tono_duracion,
            telf_duracion : request.body.telf_duracion,
            cf_itinerario : request.body.cf_itinerario,
            foto : foto,
            orden_itinerario : orden_itinerario,
            horario1_inicio : request.body.horario1_inicio,
            horario1_final : request.body.horario1_final,
            horario2_inicio : request.body.horario2_inicio,
            horario2_final : request.body.horario2_final,
            fecha : request.body.fecha,
            lat : request.body.lat,
            lon : request.body.lon
        };
        response.locals.database.updateCannotPickup(cannotPickup_data, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id/update/putOnRoute', function(request, response, next){
    if (	!request.body.id_repartidor 		|| 
    		!request.body.cf_agencia 			|| 
    		!request.body.cf_estado 			|| 
    		!request.body.cf_itinerario 		|| 
    		!request.body.fecha				 	
    ){
    	response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
    	// Controlamos las variables opcionales
    	var orden_itinerario;
    	if( typeof request.body.orden_itinerario == undefined ){
	    	orden_itinerario = null;
    	}else{
	    	orden_itinerario = request.body.orden_itinerario;
    	}
    	
    	var putOnRoute_data = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            cf_agencia : request.body.cf_agencia,
            cf_estado : request.body.cf_estado,
            cf_itinerario : request.body.cf_itinerario,
            orden_itinerario : orden_itinerario,
            fecha : request.body.fecha,
            lat : request.body.lat,
            lon : request.body.lon
        };
        response.locals.database.updatePutOnRoute(putOnRoute_data, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id/update/putToBeCollected', function(request, response, next){
    if (	!request.body.id_repartidor 		|| 
    		!request.body.cf_agencia 			|| 
    		!request.body.cf_estado 			|| 
    		!request.body.cf_itinerario 		|| 
    		!request.body.fecha				 	
    ){
	    response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
    	// Controlamos las variables opcionales
    	var orden_itinerario;
    	if( typeof request.body.orden_itinerario == undefined ){
	    	orden_itinerario = null;
    	}else{
	    	orden_itinerario = request.body.orden_itinerario;
    	}
    	
    	var putToBeCollected_data = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            cf_agencia : request.body.cf_agencia,
            cf_estado : request.body.cf_estado,
            cf_itinerario : request.body.cf_itinerario,
            orden_itinerario : orden_itinerario,
            fecha : request.body.fecha,
            lat : request.body.lat,
            lon : request.body.lon
        };
        response.locals.database.updatePutToBeCollected(putToBeCollected_data, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

router.post('/:id/update/postpone', function(request, response, next){
    if (	!request.body.id_repartidor 		|| 
    		!request.body.cf_agencia 			|| 
    		!request.body.cf_itinerario 		|| 
    		!request.body.fecha					|| 
    		!request.body.fecha_entrega_cliente	|| 
    		!request.body.cf_franja 
    ){
    	response.status(400).json({error : http.STATUS_CODES[400]});
    } else {
    	// Controlamos las variables opcionales
    	var orden_itinerario;
    	if( typeof request.body.orden_itinerario == undefined ){
	    	orden_itinerario = null;
    	}else{
	    	orden_itinerario = request.body.orden_itinerario;
    	}
    	var postpone_data = {
            id : request.params.id,
            id_repartidor : request.body.id_repartidor,
            cf_agencia : request.body.cf_agencia,
            cf_itinerario : request.body.cf_itinerario,
            orden_itinerario : orden_itinerario,
            fecha : request.body.fecha,
            fecha_entrega_cliente : request.body.fecha_entrega_cliente,
            cf_franja : request.body.cf_franja,
            horario1_inicio : request.body.horario1_inicio,
            horario1_final : request.body.horario1_final,
            horario2_inicio : request.body.horario2_inicio,
            horario2_final : request.body.horario2_final,
            lat : request.body.lat,
            lon : request.body.lon
        };
        response.locals.database.updatePostpone(postpone_data, function(error, results){
            if (error){
                response.status(500).json({error : error.message});
            } else {
                response.json(results);
            }
        });
    }
});

module.exports = router;