var mysql = require('mysql');

var readParcels = function(ids, mode, callback){
	var self = this;
	if(!callback){
        callback = mode;
        mode = false;
    }
    if(mode != false && mode.toUpperCase() == 'FULL'){
		var queryParcels = ""+
			"SELECT "+
				"p.id2, "+
				"p.expedicion, "+
				"p.num_pedido, "+
				"p.cf_tipo_demanda, "+
				"tdd.descripcion AS 'cf_tipo_demanda_desc', "+
				"p.cf_tipo_servicio, "+
				"ts.descripcion AS 'cf_tipo_servicio_desc', "+
				"p.cf_estado, "+
				"ep.descripcion AS 'cf_estado_desc', "+
				"p.cf_franja, "+
				"fr.descripcion AS 'cf_franja_desc', "+
				"p.comentarios_repartidor, "+
				"p.comentarios_cliente, "+
				"p.orden_itinerario, "+
				"p.cf_tipo_destino, "+
				"td.descripcion AS 'cf_tipo_destino_desc', "+
				"p.cf_agencia_origen, "+
				"age1.nombre_agencia AS 'cf_agencia_origen_desc', "+
				"p.cf_agencia_destino, "+
				"age2.nombre_agencia AS 'cf_agencia_destino_desc', "+
				"age2.cf_tipo_moneda, "+
				"tm.moneda AS 'tipo_moneda_iso', "+
				"tm.simbolo AS 'tipo_moneda_simbolo', "+
				"tm.html_tag AS 'tipo_moneda_entity', "+
				"DATE_FORMAT(p.fecha_alta, '%Y-%m-%d %H:%i:%s') AS 'fecha_alta', "+
				"DATE_FORMAT(p.fecha_entrega_cliente, '%Y-%m-%d') AS 'fecha_entrega_cliente', "+
				"DATE_FORMAT(p.fecha_entrega_prevista, '%Y-%m-%d %H:%i:%s') AS 'fecha_entrega_prevista', "+
				"DATE_FORMAT(p.fecha_entrega_estimada_inf, '%Y-%m-%d %H:%i:%s') AS 'fecha_entrega_estimada_inf', "+
				"DATE_FORMAT(p.fecha_entrega_estimada_sup, '%Y-%m-%d %H:%i:%s') AS 'fecha_entrega_estimada_sup', "+
				"p.cf_itinerario, "+
				"p.cf_tipo_via, "+
				"tv1.descripcion AS 'cf_tipo_via_desc', "+
				"p.direccion, "+
				"p.numero, "+
				"p.cp, "+
				"p.otros_direccion, "+
				"p.localidad, "+
				"CONCAT(p.direccion, ' ', p.numero, ' ', p.cp, ' ', p.localidad) AS 'direccion_completa', "+
				"CONCAT(p.direccion, ' ', p.numero) AS 'direccion_listado', "+
				"p.lat, "+
				"p.lon, "+
				"p.cf_tipo_via_devo, "+
				"tv2.descripcion AS 'cf_tipo_via_devo_desc', "+
				"p.direccion_devo, "+
				"p.numero_devo, "+
				"p.cp_devo, "+
				"p.otros_direccion_devo, "+
				"p.localidad_devo, "+
				"CONCAT(p.direccion_devo, ' ', p.numero_devo, ' ', p.cp_devo, ' ', p.localidad_devo) AS 'direccion_devo_completa', "+
				"CONCAT(p.direccion_devo, ' ', p.numero_devo) AS 'direccion_devo_listado', "+
				"p.lat_devo, "+
				"p.lon_devo, "+
				"p.nombre_destinatario, "+
				"p.telf_destinatario, "+
				"p.telf_destinatario_2, "+
				"p.email, "+
				"p.bultos, "+
				"p.alto, "+
				"p.ancho, "+
				"p.largo, "+
				"p.peso, "+
				"p.con_retorno, "+
				"p.retorno_link, "+
				"p.ifConflictivo, "+
				"p.horario1_inicio, "+
				"p.horario1_final, "+
				"p.horario2_inicio, "+
				"p.horario2_final, "+
				"p.valor_reembolso "+
				
			"FROM argos_entregas AS p "+
				"LEFT JOIN argos_tipos_demanda AS tdd ON (tdd.id2 = p.cf_tipo_demanda) "+
				"LEFT JOIN argos_estados_entregas AS ep ON (ep.id2 = p.cf_estado) "+
				"LEFT JOIN argos_franjas_entrega AS fr ON (fr.id2 = p.cf_franja) "+
				"LEFT JOIN argos_tipos_destinos AS td ON (td.id2 = p.cf_tipo_destino) "+
				"LEFT JOIN argos_agencias AS age1 ON (age1.id2 = p.cf_agencia_origen) "+
				"LEFT JOIN argos_agencias AS age2 ON (age2.id2 = p.cf_agencia_destino) "+
				"LEFT JOIN argos_tipos_monedas AS tm ON (tm.id2 = age2.cf_tipo_moneda) "+
				"LEFT JOIN argos_tipos_vias AS tv1 ON (tv1.id2 = p.cf_tipo_via) "+
				"LEFT JOIN argos_tipos_vias AS tv2 ON (tv2.id2 = p.cf_tipo_via_devo) "+
				"LEFT JOIN argos_tipos_servicios AS ts ON (ts.id2 = p.cf_tipo_servicio) "+
				
			"WHERE "+
				"tdd.idioma = 1 AND "+
				"ep.idioma = 1 AND "+
				"fr.idioma = 1 AND "+
				"td.idioma = 1 AND "+
				"tv1.idioma = 1 AND "+
				"tv2.idioma = 1 AND "+
				"ts.idioma = 1 AND "+
				"p.id2 IN (";
	}else{
		var queryParcels = ""+
			"SELECT "+
				"p.id2, "+
				"p.expedicion, "+
				"p.num_pedido, "+
				"p.orden_itinerario, "+
				"DATE_FORMAT(p.fecha_alta, '%Y-%m-%d%H:%i:%s') AS 'fecha_alta', "+
				"DATE_FORMAT(p.fecha_entrega_cliente, '%Y-%m-%d') AS 'fecha_entrega_cliente', "+
				"DATE_FORMAT(p.fecha_entrega_prevista, '%Y-%m-%d %H:%i:%s') AS 'fecha_entrega_prevista', "+
				"DATE_FORMAT(p.fecha_entrega_estimada_inf, '%Y-%m-%d %H:%i:%s') AS 'fecha_entrega_estimada_inf', "+
				"DATE_FORMAT(p.fecha_entrega_estimada_sup, '%Y-%m-%d %H:%i:%s') AS 'fecha_entrega_estimada_sup', "+
				"CONCAT(p.direccion, ' ', p.numero, ' ', p.cp, ' ', p.localidad) AS 'direccion_completa', "+
				"CONCAT(p.direccion, ' ', p.numero) AS 'direccion_listado', "+
				"CONCAT(p.direccion_devo, ' ', p.numero_devo, ' ', p.cp_devo, ' ', p.localidad_devo) AS 'direccion_devo_completa', "+
				"CONCAT(p.direccion_devo, ' ', p.numero_devo) AS 'direccion_devo_listado', "+
				"p.cf_tipo_servicio, "+
				"ts.descripcion AS 'cf_tipo_servicio_desc' "+
				
			"FROM argos_entregas AS p "+
				"LEFT JOIN argos_tipos_servicios AS ts ON (ts.id2 = p.cf_tipo_servicio) "+
			
			"WHERE  "+
				"ts.idioma = 1 AND "+
				"p.id2 IN (";
	}
	
	for (var i = 0; i < ids.length; i++){
        queryParcels += i == 0 ? mysql.escape(ids[i]) : ',' + mysql.escape(ids[i]);
    }
    queryParcels += ")"; 
    
    // Query process
	this._query(queryParcels, function(error, results){
		if(error){
			callback(error);
		}else if(results.lenght == 0){
			callback(null, []);
		}else{
			// Parse results
			Object.keys(results).forEach(function(key){
				if(mode != false && mode.toUpperCase() == 'FULL'){
	        		results[key].mode = 'FULL';
	        		
	        		// Swaps addresses on collected returned items
	        		if(results[key].cf_tipo_servicio == self.constants.ServiceTypes.RETURN && results[key].cf_estado != self.constants.ParcelStatus.TO_BE_COLLECTED){
	        			results[key].cf_tipo_via = results[key].cf_tipo_via_devo;
						results[key].cf_tipo_via_desc = results[key].cf_tipo_via_desc_devo;
						results[key].direccion = results[key].direccion_devo;
						results[key].numero = results[key].numero_devo;
						results[key].cp = results[key].cp_devo;
						results[key].otros_direccion = results[key].otros_direccion_devo;
						results[key].localidad = results[key].localidad_devo;
						results[key].lat = results[key].lat_devo;
						results[key].lon = results[key].lon_devo;
	        		}
	        		
	        		// Delete useless fields
	        		delete results[key].cf_tipo_via_devo;
					delete results[key].cf_tipo_via_desc_devo;
					delete results[key].direccion_devo;
					delete results[key].numero_devo;
					delete results[key].cp_devo;
					delete results[key].otros_direccion_devo;
					delete results[key].localidad_devo;
					delete results[key].lat_devo;
					delete results[key].lon_devo;
				}else{
					results[key].mode = 'SIMPLE';
				}
				
				// Swaps addresses on collected returned items
				if(results[key].cf_tipo_servicio == self.constants.ServiceTypes.RETURN && results[key].cf_estado != self.constants.ParcelStatus.TO_BE_COLLECTED){
					results[key].direccion_completa = results[key].direccion_devo_completa;
					results[key].direccion_listado = results[key].direccion_devo_listado;
				}
				
				// Delete useless fields
				delete results[key].direccion_devo_completa;
				delete results[key].direccion_devo_listado;
				
				var arrayFranjas = [];
				if(results[key].conf_franja == 1){
					var franja = {id2: "1", descripcion: "MAÑANA (09:00 - 14:00)"}; 
					arrayFranjas.push(franja);
					var franja = {id2: "2", descripcion: "TARDE (15:00 - 18:30)"}; 
					arrayFranjas.push(franja);
					var franja = {id2: "3", descripcion: "NOCHE (19:00 - 22:00)"}; 
					arrayFranjas.push(franja);
				}else{
					var franja = {id2: "1", descripcion: "DIURNA (09:00 - 17:00)"}; 
					arrayFranjas.push(franja);
					var franja = {id2: "2", descripcion: "TARDE (15:00 - 18:30)"}; 
					arrayFranjas.push(franja);
				}
				results[key].franjas_aplicables = arrayFranjas;
			});
			callback(null, results);
		}
	});
}

var readParcelsDeviceIds = function(ids, callback){
	var query = 'SELECT DISTINCT i.hash_dispositivo ' +
				'FROM argos_itinerarios AS i LEFT JOIN argos_entregas AS p ON (i.id2 = p.cf_itinerario) ' +
				'WHERE p.id2 IN (';
	for (var i = 0; i < ids.length; i++){
        query += i == 0 ? mysql.escape(ids[i]) : ',' + mysql.escape(ids[i]);
    }
    query += ')';
	this._query(query, function(error, results){
		if(error){
			callback(error);
		}else{
			var deviceIds = [];
			for (var i = 0; i < results.length; i++){
				if (results[i].hash_dispositivo && results[i].hash_dispositivo !== ''){
					deviceIds.push(results[i].hash_dispositivo);
				}
			}
			callback(null, deviceIds);
		}
	});
};

var updateDestinationType = function(parcel_destination, callback){
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_tipo_destino = "+mysql.escape(parcel_destination.cf_tipo_destino)+" "+
    	"WHERE id2 = "+mysql.escape(parcel_destination.id);
    		
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
            callback(null, {updated : results.affectedRows});
        }
    });
};

var updateGeolocation = function(geo_data, callback){
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"lat = '"+mysql.escape(geo_data.lat)+"', "+
    		"lon = '"+mysql.escape(geo_data.lon)+"' "+
    	"WHERE id2 = "+mysql.escape(geo_data.id);
    	
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
            callback(null, {updated : results.affectedRows});
        }
    });
};

var updateDriverComments = function(comments, callback){
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"comentarios_repartidor = "+mysql.escape(comments.comentarios_repartidor)+" "+
    	"WHERE id2 = "+mysql.escape(comments.id);
    
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
            callback(null, {updated : results.affectedRows});
        }
    });
};

var updateDelivery = function(delivery_data, callback){
	var self = this;
	// Actualizamos primero el paquete
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_estado = 3 "+
    	"WHERE id2 = "+mysql.escape(delivery_data.id);
    	
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
        	var img_jpg = new Buffer(delivery_data.firma, 'base64');
        	
        	// Registramos luego el intento
        	var queryIntento = ""+
        		"INSERT INTO argos_entregas_intentos "+
        			"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento, texto_intento, lat, lon, img_intento) "+
        		"VALUES ("+ 
        			"NULL, "+
        			""+mysql.escape(delivery_data.cf_agencia)+", "+
        			""+mysql.escape(delivery_data.id)+", "+
        			""+mysql.escape(delivery_data.cf_itinerario)+", "+
        			""+mysql.escape(delivery_data.orden_itinerario)+", "+
        			""+mysql.escape(delivery_data.id_repartidor)+", "+
        			"3, "+
        			""+mysql.escape(delivery_data.fecha_entrega_final)+", "+
        			""+mysql.escape(delivery_data.comentarios_entrega)+", "+
        			""+mysql.escape(delivery_data.lat)+", "+
        			""+mysql.escape(delivery_data.lon)+", "+
        			""+mysql.escape(img_jpg)+" "+
        		")";
        	
        	self._query(queryIntento, function(error, resultIntento){
	        	if (error) {
		        	callback(error);
	        	} else {
		        	// Registramos en el log la accion realizada
		        	var queryLog = ""+
		        		"INSERT INTO argos_notificaciones_entregas "+
		        			"(id2, cf_entrega, cf_itinerario, cf_repartidor, titulo_notificacion, texto_notificacion, fecha_creacion)"+
		        		"VALUES ("+ 
		        			"NULL, "+
		        			""+mysql.escape(delivery_data.id)+", "+
		        			""+mysql.escape(delivery_data.cf_itinerario)+", "+
		        			""+mysql.escape(delivery_data.id_repartidor)+", "+
		        			"'Titulo notificacion', "+
		        			"'Texto notificacion', "+
		        			"now()"+
		        		")";
		        	
		        	self._query(queryLog, function(error, resultLog){
			        	if (error) {
				        	callback(error);
			        	} else {
				        	callback(null, {updated : results.affectedRows});
			        	}
		        	});
	        	}
        	});
        }
    });
};

var updateCannotDeliver = function(cannotDelivery_data, callback){
	var self = this;
	// Actualizamos primero el paquete
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_estado = "+mysql.escape(cannotDelivery_data.cf_estado)+", "+
    		"horario1_inicio = "+mysql.escape(cannotDelivery_data.horario1_inicio)+", "+
    		"horario1_final = "+mysql.escape(cannotDelivery_data.horario1_final)+", "+
    		"horario2_inicio = "+mysql.escape(cannotDelivery_data.horario2_inicio)+", "+
    		"horario2_final = "+mysql.escape(cannotDelivery_data.horario2_final)+" "+
    	"WHERE id2 = "+mysql.escape(cannotDelivery_data.id);
    	
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
        	var foto = null;
        	if(cannotDelivery_data.foto != null){
	        	foto = new Buffer(cannotDelivery_data.foto, 'base64');
        	}
        	// Registramos luego el intento
        	var queryIntento = ""+
        		"INSERT INTO argos_entregas_intentos "+
        			"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento, tono_duracion, telf_duracion, lat, lon, img_intento) "+
        		"VALUES ("+ 
        			"NULL, "+
        			""+mysql.escape(cannotDelivery_data.cf_agencia)+", "+
        			""+mysql.escape(cannotDelivery_data.id)+", "+
        			""+mysql.escape(cannotDelivery_data.cf_itinerario)+", "+
        			""+mysql.escape(cannotDelivery_data.orden_itinerario)+", "+
        			""+mysql.escape(cannotDelivery_data.id_repartidor)+", "+
        			""+mysql.escape(cannotDelivery_data.cf_estado)+", "+
        			""+mysql.escape(cannotDelivery_data.fecha_entrega_final)+", "+
        			""+mysql.escape(cannotDelivery_data.tono_duracion)+", "+
        			""+mysql.escape(cannotDelivery_data.telf_duracion)+", "+
        			""+mysql.escape(cannotDelivery_data.lat)+", "+
        			""+mysql.escape(cannotDelivery_data.lon)+", "+
        			""+mysql.escape(foto)+" "+
        		")";
        	
        	self._query(queryIntento, function(error, resultIntento){
	        	if (error) {
		        	callback(error);
	        	} else {
		        	// Registramos en el log la accion realizada
		        	var queryLog = ""+
		        		"INSERT INTO argos_notificaciones_entregas "+
		        			"(id2, cf_entrega, cf_itinerario, cf_repartidor, titulo_notificacion, texto_notificacion, fecha_creacion)"+
		        		"VALUES ("+ 
		        			"NULL, "+
		        			""+mysql.escape(cannotDelivery_data.id)+", "+
		        			""+mysql.escape(cannotDelivery_data.cf_itinerario)+", "+
		        			""+mysql.escape(cannotDelivery_data.id_repartidor)+", "+
		        			"'Titulo notificacion', "+
		        			"'Texto notificacion', "+
		        			"now()"+
		        		")";
		        	
		        	self._query(queryLog, function(error, resultLog){
			        	if (error) {
				        	callback(error);
			        	} else {
				        	callback(null, {updated : results.affectedRows});
			        	}
		        	});
	        	}
        	});
        }
    });
};

var updatePickup = function(pickup_data, callback){
	var self = this;
	// Actualizamos primero el paquete
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_estado = 8 "+
    	"WHERE id2 = "+mysql.escape(pickup_data.id);
    	
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
        	var img_jpg = new Buffer(pickup_data.firma, 'base64');
        
        	// Registramos luego el intento
        	var queryIntento = ""+
        		"INSERT INTO argos_entregas_intentos "+
        			"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento, lat, lon, img_intento) "+
        		"VALUES ("+ 
        			"NULL, "+
        			""+mysql.escape(pickup_data.cf_agencia)+", "+
        			""+mysql.escape(pickup_data.id)+", "+
        			""+mysql.escape(pickup_data.cf_itinerario)+", "+
        			""+mysql.escape(pickup_data.orden_itinerario)+", "+
        			""+mysql.escape(pickup_data.id_repartidor)+", "+
        			"8, "+
        			""+mysql.escape(pickup_data.fecha_entrega_final)+", "+
        			""+mysql.escape(pickup_data.lat)+", "+
        			""+mysql.escape(pickup_data.lon)+", "+
        			""+mysql.escape(img_jpg)+" "+
        		")";
        	
        	self._query(queryIntento, function(error, resultIntento){
	        	if (error) {
		        	callback(error);
	        	} else {
		        	// Registramos en el log la accion realizada
		        	// telf_duracion
		        	var queryLog = ""+
		        		"INSERT INTO argos_notificaciones_entregas "+
		        			"(id2, cf_entrega, cf_itinerario, cf_repartidor, titulo_notificacion, texto_notificacion, fecha_creacion)"+
		        		"VALUES ("+ 
		        			"NULL, "+
		        			""+mysql.escape(pickup_data.id)+", "+
		        			""+mysql.escape(pickup_data.cf_itinerario)+", "+
		        			""+mysql.escape(pickup_data.id_repartidor)+", "+
		        			"'Titulo notificacion', "+
		        			"'Texto notificacion', "+
		        			"now()"+
		        		")";
		        	
		        	self._query(queryLog, function(error, resultLog){
			        	if (error) {
				        	callback(error);
			        	} else {
			        		// Si hemos recibido punteo, recibimos tambien los pedidos punteados
			        		if(pickup_data.punteo.length > 0){
			        			// Implode del array de punteo
				        		var whereExp = "";
				        		pickup_data.punteo.forEach(function(entry) {
					        		whereExp += "'"+entry+"',"
								});
								whereExp = whereExp.substring(0, whereExp.length - 1);
								
								// Recibimos los pedidos en precargas
								var queryRecepcionPrecargas = ""+
									"UPDATE argos_entregas_webservice SET "+
										"cf_estado = 8 "+
									"WHERE expedicion IN (" + whereExp + ")";
								
								self._query(queryRecepcionPrecargas, function(error, resultRecepcionPrecargas){
						        	if (error) {
							        	callback(error);
						        	} else {
						        		// Recibimos los pedidos en expediciones
						        		var queryRecepcionExpediciones = ""+
											"UPDATE argos_entregas_webservice SET "+
												"cf_estado = 1 "+
											"WHERE expedicion IN (" + whereExp + ")";
										
										self._query(queryRecepcionExpediciones, function(error, resultRecepcionExpediciones){
								        	if (error) {
									        	callback(error);
								        	} else {
								        		var msgResult = "Las "+pickup_data.punteo.length+" expediciones se han recogido.";
								        		callback(null, {updated : results.affectedRows, response_text : msgResult});
								        	}
										});
						        	}
								});
				        	}else{
				        		var msgResult = "No hay punteo que comprobar.";
				        		callback(null, {updated : results.affectedRows, response_text : msgResult});	
			        		}
			        	}
		        	});
	        	}
        	});
        }
    });
};

var updateCannotPickup = function(cannotPickup_data, callback){
	var self = this;
	// Actualizamos primero el paquete
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_estado = "+mysql.escape(cannotPickup_data.cf_estado)+", "+
    		"horario1_inicio = "+mysql.escape(cannotPickup_data.horario1_inicio)+", "+
    		"horario1_final = "+mysql.escape(cannotPickup_data.horario1_final)+", "+
    		"horario2_inicio = "+mysql.escape(cannotPickup_data.horario2_inicio)+", "+
    		"horario2_final = "+mysql.escape(cannotPickup_data.horario2_final)+" "+
    	"WHERE id2 = "+mysql.escape(cannotPickup_data.id);
    	
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
        	var foto = null;
        	if(cannotDelivery_data.foto != null){
	        	foto = new Buffer(cannotDelivery_data.foto, 'base64');
        	}
        	// Registramos luego el intento
        	var queryIntento = ""+
        		"INSERT INTO argos_entregas_intentos "+
        			"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento, tono_duracion, telf_duracion, lat, lon, img_intento) "+
        		"VALUES ("+ 
        			"NULL, "+
        			""+mysql.escape(cannotPickup_data.cf_agencia)+", "+
        			""+mysql.escape(cannotPickup_data.id)+", "+
        			""+mysql.escape(cannotPickup_data.cf_itinerario)+", "+
        			""+mysql.escape(cannotPickup_data.orden_itinerario)+", "+
        			""+mysql.escape(cannotPickup_data.id_repartidor)+", "+
        			""+mysql.escape(cannotPickup_data.cf_estado)+", "+
        			""+mysql.escape(cannotPickup_data.fecha)+", "+
        			""+mysql.escape(cannotPickup_data.tono_duracion)+", "+
        			""+mysql.escape(cannotPickup_data.telf_duracion)+", "+
        			""+mysql.escape(cannotPickup_data.lat)+", "+
        			""+mysql.escape(cannotPickup_data.lon)+", "+
        			""+mysql.escape(foto)+" "+
        		")";
        	
        	self._query(queryIntento, function(error, resultIntento){
	        	if (error) {
		        	callback(error);
	        	} else {
		        	// Registramos en el log la accion realizada
		        	var queryLog = ""+
		        		"INSERT INTO argos_notificaciones_entregas "+
		        			"(id2, cf_entrega, cf_itinerario, cf_repartidor, titulo_notificacion, texto_notificacion, fecha_creacion)"+
		        		"VALUES ("+ 
		        			"NULL, "+
		        			""+mysql.escape(cannotPickup_data.id)+", "+
		        			""+mysql.escape(cannotPickup_data.cf_itinerario)+", "+
		        			""+mysql.escape(cannotPickup_data.id_repartidor)+", "+
		        			"'Titulo notificacion', "+
		        			"'Texto notificacion', "+
		        			"now()"+
		        		")";
		        	
		        	self._query(queryLog, function(error, resultLog){
			        	if (error) {
				        	callback(error);
			        	} else {
				        	callback(null, {updated : results.affectedRows});
			        	}
		        	});
	        	}
        	});
        }
    });
};

var updatePutOnRoute = function(cannotPickup_data, callback){
	var self = this;
	// Actualizamos primero el paquete
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_estado = "+mysql.escape(cannotPickup_data.cf_estado)+" "+
    	"WHERE id2 = "+mysql.escape(cannotPickup_data.id);
    	
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
        	// Registramos luego el intento
        	var queryIntento = ""+
        		"INSERT INTO argos_entregas_intentos "+
        			"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento, lat, lon) "+
        		"VALUES ("+ 
        			"NULL, "+
        			""+mysql.escape(cannotPickup_data.cf_agencia)+", "+
        			""+mysql.escape(cannotPickup_data.id)+", "+
        			""+mysql.escape(cannotPickup_data.cf_itinerario)+", "+
        			""+mysql.escape(cannotPickup_data.orden_itinerario)+", "+
        			""+mysql.escape(cannotPickup_data.id_repartidor)+", "+
        			""+mysql.escape(cannotPickup_data.cf_estado)+", "+
        			""+mysql.escape(cannotPickup_data.fecha)+", "+
        			""+mysql.escape(cannotPickup_data.lat)+", "+
        			""+mysql.escape(cannotPickup_data.lon)+" "+
        		")";
        	
        	self._query(queryIntento, function(error, resultIntento){
	        	if (error) {
		        	callback(error);
	        	} else {
		        	// Registramos en el log la accion realizada
		        	var queryLog = ""+
		        		"INSERT INTO argos_notificaciones_entregas "+
		        			"(id2, cf_entrega, cf_itinerario, cf_repartidor, titulo_notificacion, texto_notificacion, fecha_creacion)"+
		        		"VALUES ("+ 
		        			"NULL, "+
		        			""+mysql.escape(cannotPickup_data.id)+", "+
		        			""+mysql.escape(cannotPickup_data.cf_itinerario)+", "+
		        			""+mysql.escape(cannotPickup_data.id_repartidor)+", "+
		        			"'Titulo notificacion', "+
		        			"'Texto notificacion', "+
		        			"now()"+
		        		")";
		        	
		        	self._query(queryLog, function(error, resultLog){
			        	if (error) {
				        	callback(error);
			        	} else {
				        	callback(null, {updated : results.affectedRows});
			        	}
		        	});
	        	}
        	});
        }
    });
};

var updatePutToBeCollected = function(putToBeCollected_data, callback){
	var self = this;
	// Actualizamos primero el paquete
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_estado = "+mysql.escape(putToBeCollected_data.cf_estado)+" "+
    	"WHERE id2 = "+mysql.escape(putToBeCollected_data.id);
    	
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
        	// Registramos luego el intento
        	var queryIntento = ""+
        		"INSERT INTO argos_entregas_intentos "+
        			"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento, lat, lon) "+
        		"VALUES ("+ 
        			"NULL, "+
        			""+mysql.escape(putToBeCollected_data.cf_agencia)+", "+
        			""+mysql.escape(putToBeCollected_data.id)+", "+
        			""+mysql.escape(putToBeCollected_data.cf_itinerario)+", "+
        			""+mysql.escape(putToBeCollected_data.orden_itinerario)+", "+
        			""+mysql.escape(putToBeCollected_data.id_repartidor)+", "+
        			""+mysql.escape(putToBeCollected_data.cf_estado)+", "+
        			""+mysql.escape(putToBeCollected_data.fecha)+", "+
        			""+mysql.escape(putToBeCollected_data.lat)+", "+
        			""+mysql.escape(putToBeCollected_data.lon)+" "+
        		")";
        	
        	self._query(queryIntento, function(error, resultIntento){
	        	if (error) {
		        	callback(error);
	        	} else {
		        	// Registramos en el log la accion realizada
		        	var queryLog = ""+
		        		"INSERT INTO argos_notificaciones_entregas "+
		        			"(id2, cf_entrega, cf_itinerario, cf_repartidor, titulo_notificacion, texto_notificacion, fecha_creacion)"+
		        		"VALUES ("+ 
		        			"NULL, "+
		        			""+mysql.escape(putToBeCollected_data.id)+", "+
		        			""+mysql.escape(putToBeCollected_data.cf_itinerario)+", "+
		        			""+mysql.escape(putToBeCollected_data.id_repartidor)+", "+
		        			"'Titulo notificacion', "+
		        			"'Texto notificacion', "+
		        			"now()"+
		        		")";
		        	
		        	self._query(queryLog, function(error, resultLog){
			        	if (error) {
				        	callback(error);
			        	} else {
				        	callback(null, {updated : results.affectedRows});
			        	}
		        	});
	        	}
        	});
        }
    });
};

var updatePostpone = function(postpone_data, callback){
	var self = this;
	// Actualizamos primero el paquete
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_estado = 14, "+
    		"fecha_entrega_cliente = "+mysql.escape(postpone_data.fecha_entrega_cliente)+", "+
    		"cf_franja = "+mysql.escape(postpone_data.cf_franja)+", "+
    		"horario1_inicio = "+mysql.escape(postpone_data.horario1_inicio)+", "+
    		"horario1_final = "+mysql.escape(postpone_data.horario1_final)+", "+
    		"horario2_inicio = "+mysql.escape(postpone_data.horario2_inicio)+", "+
    		"horario2_final = "+mysql.escape(postpone_data.horario2_final)+" "+
    	"WHERE id2 = "+mysql.escape(postpone_data.id);
    
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
        	// Registramos luego el intento
        	var queryIntento = ""+
        		"INSERT INTO argos_entregas_intentos "+
        			"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento, lat, lon) "+
        		"VALUES ("+ 
        			"NULL, "+
        			""+mysql.escape(postpone_data.cf_agencia)+", "+
        			""+mysql.escape(postpone_data.id)+", "+
        			""+mysql.escape(postpone_data.cf_itinerario)+", "+
        			""+mysql.escape(postpone_data.orden_itinerario)+", "+
        			""+mysql.escape(postpone_data.id_repartidor)+", "+
        			"14, "+
        			""+mysql.escape(postpone_data.fecha)+", "+
        			""+mysql.escape(postpone_data.lat)+", "+
        			""+mysql.escape(postpone_data.lon)+" "+
        		")";
        	self._query(queryIntento, function(error, resultIntento){
	        	if (error) {
		        	callback(error);
	        	} else {
		        	// Registramos en el log la accion realizada
		        	// telf_duracion
		        	var queryLog = ""+
		        		"INSERT INTO argos_notificaciones_entregas "+
		        			"(id2, cf_entrega, cf_itinerario, cf_repartidor, titulo_notificacion, texto_notificacion, fecha_creacion)"+
		        		"VALUES ("+ 
		        			"NULL, "+
		        			""+mysql.escape(postpone_data.id)+", "+
		        			""+mysql.escape(postpone_data.cf_itinerario)+", "+
		        			""+mysql.escape(postpone_data.id_repartidor)+", "+
		        			"'Titulo notificacion', "+
		        			"'Texto notificacion', "+
		        			"now()"+
		        		")";
		        	
		        	self._query(queryLog, function(error, resultLog){
			        	if (error) {
				        	callback(error);
			        	} else {
				        	callback(null, {updated : results.affectedRows});
			        	}
		        	});
	        	}
        	});
        }
    });
};



module.exports = function(prototype){
    prototype.readParcels = readParcels;
    prototype.readParcelsDeviceIds = readParcelsDeviceIds;
    prototype.updateDestinationType = updateDestinationType;
    prototype.updateGeolocation = updateGeolocation;
    prototype.updateDriverComments = updateDriverComments;
    prototype.updateDelivery = updateDelivery;
    prototype.updateCannotDeliver = updateCannotDeliver;
    prototype.updatePickup = updatePickup;
    prototype.updateCannotPickup = updateCannotPickup;
    prototype.updatePutOnRoute = updatePutOnRoute;
    prototype.updatePutToBeCollected = updatePutToBeCollected;
    prototype.updatePostpone = updatePostpone;
};
