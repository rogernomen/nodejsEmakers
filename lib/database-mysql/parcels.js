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
				"ab.nombre_abonado, "+
				"(valor_reembolso+valor_reembolso_premium) as 'valor_reembolso', "+
				"p.fase "+
				
			"FROM argos_entregas AS p "+
				"LEFT JOIN argos_abonados AS ab ON (ab.codigo_abonado = p.cf_abonado) "+
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
		}else if(results.length == 0){
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
    		"cf_estado = 3, "+
    		"ifNotifiedAbonado = 0 "+
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
    		"horario2_final = "+mysql.escape(cannotDelivery_data.horario2_final)+", "+
    		"ifNotifiedAbonado = 0 "+
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
	var fase = 1;
	if(pickup_data.cf_tipo_demanda == 3){
		fase = 2;
	}
	// Actualizamos primero el paquete
    var query = ""+
    	"UPDATE argos_entregas SET "+
    		"cf_estado = 8, "+
    		"fase = "+fase+", "+
    		"ifNotifiedAbonado = 0 "+
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
    		"horario2_final = "+mysql.escape(cannotPickup_data.horario2_final)+", "+
    		"ifNotifiedAbonado = 0 "+
    	"WHERE id2 = "+mysql.escape(cannotPickup_data.id);
    	
    this._query(query, function(error, results){
        if (error) {
            callback(error);
        } else {
        	var foto = null;
        	if(cannotPickup_data.foto != null){
	        	foto = new Buffer(cannotPickup_data.foto, 'base64');
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
    		"cf_estado = "+mysql.escape(cannotPickup_data.cf_estado)+", "+
    		"ifNotifiedAbonado = 0 "+
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
    		"cf_estado = "+mysql.escape(putToBeCollected_data.cf_estado)+", "+
    		"fase = 1, "+
    		"ifNotifiedAbonado = 0 "+
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
    		"horario2_final = "+mysql.escape(postpone_data.horario2_final)+", "+
    		"ifNotifiedAbonado = 0 "+
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

var readParcelAlmacen = function(expedicion, callback){
	var self = this;
	if(!callback){
        callback = mode;
        mode = false;
    }
    
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
			"ab.nombre_abonado, "+
			"(valor_reembolso+valor_reembolso_premium) as 'valor_reembolso', "+
			"p.fase "+
			
		"FROM argos_entregas AS p "+
			"LEFT JOIN argos_abonados AS ab ON (ab.codigo_abonado = p.cf_abonado) "+
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
			"p.expedicion = "+mysql.escape(expedicion)+"";
    // Query process
	this._query(queryParcels, function(error, results){
		if(error){
			callback(error);
		}else if(results.length == 0){
			callback(null, []);
		}else{
			// Parse results
			Object.keys(results).forEach(function(key){
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

var makeCarga = function(expedicion, response, callback){
	var self = this;
	// Primero comprobamos la posibilidad de hacer carga valorando la info del pedido
	var queryCheck = ""+
		"SELECT "+
			"e.id2, "+
			"e.cf_itinerario, "+
			"i.nombre AS 'nombre_itinerario', "+
			"i.cf_estado AS 'estado_itinerario', "+
			"e.orden_itinerario, "+
			"DATE_FORMAT(e.fecha_entrega_cliente, '%Y-%m-%d') AS 'fecha_entrega_cliente', "+
			"e.cf_franja, "+
			"fr.descripcion AS 'descripcion_franja', "+
			"e.cf_franja_premium, "+
			"fp.descripcion AS 'descripcion_franja_premium', "+
			"e.cf_agencia_destino, "+
			"age.nombre_agencia "+
		
		"FROM argos_entregas AS e "+
			"LEFT JOIN argos_itinerarios AS i ON (e.cf_itinerario = i.id2) "+
			"LEFT JOIN argos_franjas_entrega AS fr ON (e.cf_franja = fr.id2) "+
			"LEFT JOIN argos_franjas_premium AS fp ON (e.cf_franja_premium = fp.id2) "+
			"LEFT JOIN argos_agencias AS age ON (e.cf_agencia_destino = age.id2) "+
			
		"WHERE "+
			"fr.idioma = 1 AND "+
			"e.expedicion = "+mysql.escape(expedicion)+" "+
			
		"LIMIT 1";
	
	// Query process
	this._query(queryCheck, function(error, results){
		if(error){
			// Error de query
			callback(error);
		}else if(results.length == 0){
			// Puede que este en precargas...
			var queryCheckPrecargas = ""+
				"SELECT "+
					"e.id2, "+
					"DATE_FORMAT(e.fecha_entrega_cliente, '%Y-%m-%d') AS 'fecha_entrega_cliente', "+
					"e.cf_franja, "+
					"fr.descripcion AS 'descripcion_franja', "+
					"e.cf_franja_premium, "+
					"fp.descripcion AS 'descripcion_franja_premium', "+
					"e.cf_agencia_destino, "+
					"age.nombre_agencia "+
				
				"FROM argos_entregas_webservice AS e "+
					"LEFT JOIN argos_franjas_entrega AS fr ON (e.cf_franja = fr.id2) "+
					"LEFT JOIN argos_franjas_premium AS fp ON (e.cf_franja_premium = fp.id2) "+
					"LEFT JOIN argos_agencias AS age ON (e.cf_agencia_destino = age.id2) "+
					
				"WHERE "+
					"fr.idioma = 1 AND "+
					"e.expedicion = "+mysql.escape(expedicion)+" "+
					
				"LIMIT 1";

			// Query process
			self._query(queryCheckPrecargas, function(error, resultsPrecargas){
				if(error){
					// Error de query
					callback(error);
					
				}else if(resultsPrecargas.length == 0){
					// No encontramos resultados alguno
					callback(null, []);
				}else{
					// Tenemos resultado en precargas
					// Calculamos la franja a mostrar
	        		var cf_franja = 0;
	        		var descripcion_franja = "SIN ASIGNAR";
	        		if(resultsPrecargas[0].cf_franja != 0 && resultsPrecargas[0].cf_franja_premium == 0){
		        		cf_franja = resultsPrecargas[0].cf_franja;
		        		descripcion_franja = resultsPrecargas[0].descripcion_franja;
	        		}else if(resultsPrecargas[0].cf_franja == 0 && resultsPrecargas[0].cf_franja_premium != 0){
		        		cf_franja = resultsPrecargas[0].cf_franja_premium;
		        		descripcion_franja = resultsPrecargas[0].descripcion_franja_premium;
	        		}
					// Preparamos la salida
					var carga_response = {
	        			cargado: "0", 
	        			situacion: "PRECARGAS",
	        			cf_itinerario: 0,
	        			nombre_itinerario: "",
	        			orden: 0,
	        			total: 0,
	        			fecha_entrega: resultsPrecargas[0].fecha_entrega_cliente,
	        			cf_franja: cf_franja,
	        			descripcion_franja: descripcion_franja,
	        			cf_agencia_destino: resultsPrecargas[0].cf_agencia_destino,
	        			nombre_agencia: resultsPrecargas[0].nombre_agencia
	        		};
	        		
	        		// Respondemos
		        	callback(null, carga_response);
				}
			});
		// Tenemos resultado en expediciones
		}else{
			Object.keys(results).forEach(function(key){
				// Calculamos el total (solo si cumple las condiciones para enrutar)
				// Estado itinerario PREPARADO && Agencia destino == agencia que puntea
				if(results[key].estado_itinerario == self.constants.RouteStatus.READY && results[key].cf_agencia_destino == response.locals.user.agency){
					var queryTotalIte = "SELECT count(id2) AS 'total_itinerario' FROM argos_entregas WHERE cf_itinerario = "+mysql.escape(results[key].cf_itinerario)+" AND ifActiu = 1";
					// Query process
					self._query(queryTotalIte, function(error, resultsTotalIte){
						if(error){
							// Error de query
							callback(error);
						}else{
							// Obtenemos el total, ponemos EN RUTA, registramos intento, registramos log y respondemos
							var querySet_EN_RUTA = "UPDATE argos_entregas SET cf_estado = "+mysql.escape(self.constants.ParcelStatus.ON_ROUTE)+" WHERE id2 = "+mysql.escape(results[key].id2);
							self._query(querySet_EN_RUTA, function(error, resultsSet_EN_RUTA){
								if(error){
									// Error de query
									callback(error);
								}else{
									// Pedido EN RUTA, registramos intento y log antes de responder
									var queryIntento = ""+
						        		"INSERT INTO argos_entregas_intentos "+
						        			"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento) "+
						        		"VALUES ("+ 
						        			"NULL, "+
						        			""+mysql.escape(response.locals.user.agency)+", "+
						        			""+mysql.escape(results[key].id2)+", "+
						        			""+mysql.escape(results[key].cf_itinerario)+", "+
						        			""+mysql.escape(results[key].orden_itinerario)+", "+
						        			""+mysql.escape(response.locals.user.id)+", "+
						        			""+mysql.escape(self.constants.ParcelStatus.ON_ROUTE)+", "+
						        			"now()"+
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
								        			""+mysql.escape(results[key].id2)+", "+
								        			""+mysql.escape(results[key].cf_itinerario)+", "+
								        			""+mysql.escape(response.locals.user.id)+", "+
								        			"'Titulo notificacion', "+
								        			"'Texto notificacion', "+
								        			"now()"+
								        		")";
								        	
								        	self._query(queryLog, function(error, resultLog){
									        	if (error) {
										        	callback(error);
									        	} else {
									        		// Calculamos la franja a mostrar
									        		var cf_franja = 0;
									        		var descripcion_franja = "SIN ASIGNAR";
									        		if(results[key].cf_franja != 0 && results[key].cf_franja_premium == 0){
										        		cf_franja = results[key].cf_franja;
										        		descripcion_franja = results[key].descripcion_franja;
									        		}else if(results[key].cf_franja == 0 && results[key].cf_franja_premium != 0){
										        		cf_franja = results[key].cf_franja_premium;
										        		descripcion_franja = results[key].descripcion_franja_premium;
									        		}
									        		// Preparamos la salida
									        		var carga_response = {
									        			cargado: "1", 
									        			situacion: "EXPEDICIONES",
									        			cf_itinerario: results[key].cf_itinerario,
									        			nombre_itinerario: results[key].nombre_itinerario,
									        			orden: results[key].orden_itinerario,
									        			total: resultsTotalIte[0].total_itinerario,
									        			fecha_entrega: results[key].fecha_entrega_cliente,
									        			cf_franja: cf_franja,
									        			descripcion_franja: descripcion_franja,
									        			cf_agencia_destino: results[key].cf_agencia_destino,
									        			nombre_agencia: results[key].nombre_agencia
									        		}; 
									        		
									        		// Respondemos
										        	callback(null, carga_response);
									        	}
								        	});
							        	}
						        	});
								}
							});
						}
					});
				// Tenemos resultado pero no se debe poner EN RUTA
				}else{
					// Calculamos la franja a mostrar
	        		var cf_franja = 0;
	        		var descripcion_franja = "SIN ASIGNAR";
	        		if(results[key].cf_franja != 0 && results[key].cf_franja_premium == 0){
		        		cf_franja = results[key].cf_franja;
		        		descripcion_franja = results[key].descripcion_franja;
	        		}else if(results[key].cf_franja == 0 && results[key].cf_franja_premium != 0){
		        		cf_franja = results[key].cf_franja_premium;
		        		descripcion_franja = results[key].descripcion_franja_premium;
	        		}
					// Preparamos la salida
	        		var carga_response = {
	        			cargado: "0", 
	        			situacion: "EXPEDICIONES",
	        			cf_itinerario: results[key].cf_itinerario,
	        			nombre_itinerario: results[key].nombre_itinerario,
	        			orden: results[key].orden_itinerario,
	        			total: 0,
	        			fecha_entrega: results[key].fecha_entrega_cliente,
	        			cf_franja: cf_franja,
	        			descripcion_franja: descripcion_franja,
	        			cf_agencia_destino: results[key].cf_agencia_destino,
	        			nombre_agencia: results[key].nombre_agencia
	        		}; 
	        		
	        		// Respondemos
		        	callback(null, carga_response);
				}
			});
		}
	});
}

var confirmaCarga = function(confirmaCarga_data, callback){
	var self = this;
	// Primero seleccionamos los datos del pedido
	var querySelect = ""+
		"SELECT "+
			"e.id2, "+
			"e.cf_itinerario, "+
			"i.nombre AS 'nombre_itinerario', "+
			"e.orden_itinerario "+
		
		"FROM argos_entregas AS e "+
			"LEFT JOIN argos_itinerarios AS i ON (e.cf_itinerario = i.id2) "+
			
		"WHERE "+
			"e.expedicion = "+mysql.escape(confirmaCarga_data.expedicion)+" "+
		
		"LIMIT 1";
		
	// Query process
	this._query(querySelect, function(error, results){
		if(error){
			// Error de query
			callback(error);
		}else{
			// Obtenemos resultados
			if(results.length == 1){
				var carga_confirmada = "0";
				Object.keys(results).forEach(function(key){
					// Comprobamos que el itinerario corresponda
					if(results[key].cf_itinerario == confirmaCarga_data.cf_itinerario){
						carga_confirmada = "1";
						
						// Registramos intento de carga confirmada
						var queryIntento = ""+
							"INSERT INTO argos_entregas_intentos "+
								"(id2, cf_agencia, cf_entrega, cf_itinerario, orden_itinerario, cf_repartidor, cf_estado, fecha_intento) "+
							"VALUES ("+ 
								"NULL, "+
								""+mysql.escape(confirmaCarga_data.cf_agencia)+", "+
								""+mysql.escape(results[key].id2)+", "+
								""+mysql.escape(results[key].cf_itinerario)+", "+
								""+mysql.escape(results[key].orden_itinerario)+", "+
								""+mysql.escape(confirmaCarga_data.id_repartidor)+", "+
								"25, "+
								"now() "+
							")";
						self._query(queryIntento, function(error, resultIntento){
							if(error){
					        	callback(error);
				        	}else{
				        		// Caluclamos el total de pedidos del itinerario
				        		var queryTotalIte = "SELECT count(id2) AS 'total_itinerario' FROM argos_entregas WHERE cf_itinerario = "+mysql.escape(results[key].cf_itinerario)+" AND ifActiu = 1";
								// Query process
								self._query(queryTotalIte, function(error, resultsTotalIte){
									if(error){
										// Error de query
										callback(error);
									}else{
										// Una vez registrado el intento, podemos responder confirmando la carga
							        	var confirmaCarga_response = {
						        			carga_confirmada: carga_confirmada, 
						        			cf_itinerario: results[key].cf_itinerario,
						        			nombre_itinerario: results[key].nombre_itinerario,
						        			orden: results[key].orden_itinerario,
						        			total: resultsTotalIte[0].total_itinerario
						        		};
						        		
						        		// Respondemos
							        	callback(null, confirmaCarga_response);
									}
								});
				        	}
				        });
					// Respondemos sin confirmar la carga
					}else{
						// Caluclamos el total de pedidos del itinerario
		        		var queryTotalIte = "SELECT count(id2) AS 'total_itinerario' FROM argos_entregas WHERE cf_itinerario = "+mysql.escape(results[key].cf_itinerario)+" AND ifActiu = 1";
						// Query process
						self._query(queryTotalIte, function(error, resultsTotalIte){
							if(error){
								// Error de query
								callback(error);
							}else{
								// Una vez registrado el intento, podemos responder confirmando la carga
					        	var confirmaCarga_response = {
				        			carga_confirmada: carga_confirmada, 
				        			cf_itinerario: results[key].cf_itinerario,
				        			nombre_itinerario: results[key].nombre_itinerario,
				        			orden: results[key].orden_itinerario,
				        			total: resultsTotalIte[0].total_itinerario
				        		};
				        		
				        		// Respondemos
					        	callback(null, confirmaCarga_response);
							}
						});
					}
				});
			// No encontramos resultado alguno
			}else{
				callback(null, []);
			}
		}
	});
}

var getRetorno = function(numExpedicion, response, callback){
    var self = this;

    // Primero seleccionamos los datos del pedido
    var querySelect = ""+
        "SELECT e.id2, e.cf_estado, e.cf_franja, e.notas, e.fecha_entrega_cliente, " +
        "e.comentarios_repartidor, aee.descripcion, a.nombre_agencia, afe.descripcion AS desc_franja "+
        "FROM argos_entregas as e "+
        "LEFT JOIN argos_estados_entregas as aee on aee.id2 = e.cf_estado "+
        "LEFT JOIN argos_agencias as a on a.id2 = e.cf_agencia "+
        "LEFT JOIN argos_franjas_entrega as afe on afe.id2 = e.cf_franja "+
        "WHERE e.expedicion = "+mysql.escape(numExpedicion)+""+
        "AND aee.idioma = '1'";

    // Query process
    self._query(querySelect, function(error, resultQuerySelect){
        if(error){
            callback(error);
        }else{

            // Ponemos el itinerario a 0
            var queryToUpdate = "UPDATE argos_entregas "+
            "SET cf_itinerario = 0, "+
            "cf_estado = 0 "+
            "WHERE expedicion = "+mysql.escape(numExpedicion)+"";

            self._query(queryToUpdate, function (error, result) {
               if(error) {
                   callback(error);
               } else {

                    // Insert to LOG
                   // Registramos en el log la accion realizada
                   var queryLog = ""+
                       "INSERT INTO argos_notificaciones_entregas "+
                       "(id2, cf_entrega, cf_repartidor, titulo_notificacion, texto_notificacion, fecha_creacion)"+
                       "VALUES ("+
                       "NULL, "+
                       ""+mysql.escape(numExpedicion)+", "+
                       ""+mysql.escape(response.locals.user.id_repartidor)+", "+
                       "'Expedicion "+numExpedicion+" retorna', "+
                       "'"+numExpedicion+" "+response.locals.user.nombre_repartidor+" retorna a SIN ASIGNAR', "+
                       "now()"+
                       ")";

                   self._query(queryLog, function(error, resultLog){
                       if (error) {
                           callback(error);
                       } else {
                           var retorno_response = {
                               cf_itinerario: "0",
                               fecha_entrega: resultQuerySelect[0].fecha_entrega_cliente,
                               cf_franja: resultQuerySelect[0].cf_franja,
                               descripcion_franja: resultQuerySelect[0].desc_franja,
                               nombre_agencia: resultQuerySelect[0].nombre_agencia
                           };

                           callback(null, {updated : retorno_response});
                       }
                   });
               }
            });
        }
    });
};

var setRecepcion = function(numExpedicion, response, callback){
    var self = this;

    // Buscamos si existe la expedicion en precargas
    var selectPrecargas = "SELECT e.id2, e.cf_agencia_destino, e.cf_agencia_origen, a.nombre_agencia " +
        "FROM argos_entregas_webservice as e "+
        "LEFT JOIN argos_agencias as a on a.id2 = e.cf_agencia "+
        "WHERE expedicion = "+mysql.escape(numExpedicion)+"";


    // Query process
    self._query(selectPrecargas, function(error, resultPrecargasSelect){
        if(error){
            callback(error);
        }else{
            if(resultPrecargasSelect.length > 0) {
                _checkRecepcion(self,
                    numExpedicion,
                    resultPrecargasSelect[0].nombre_agencia,
                    resultPrecargasSelect[0].cf_agencia_destino,
                    resultPrecargasSelect[0].cf_agencia_origen,
                    response.locals.user.agency,
                    callback,
                    true);
            } else {
                // NO EXISTE EN PRECARGAS
                var selectExpediciones = "SELECT e.id2, e.cf_agencia_destino, e.cf_agencia_origen, a.nombre_agencia " +
                    "FROM argos_entregas as e "+
                    "LEFT JOIN argos_agencias as a on a.id2 = e.cf_agencia "+
                    "WHERE expedicion = "+mysql.escape(numExpedicion)+"";

                self._query(selectExpediciones, function (error, resultExpedicionesSelect) {
                    if(error) {
                        callback(error);
                    } else {
                        if(resultExpedicionesSelect.length > 0) {
                            _checkRecepcion(self,
                                numExpedicion,
                                resultExpedicionesSelect[0].nombre_agencia,
                                resultExpedicionesSelect[0].cf_agencia_origen,
                                resultExpedicionesSelect[0].cf_agencia_destino,
                                response.locals.user.agency,
                                callback,
                                false);
                        } else {
                            // NO ENCONTRAMOS NADA
                            callback(null, []);
                        }
                    }
                });
            }
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
    prototype.readParcelAlmacen = readParcelAlmacen;
    prototype.makeCarga = makeCarga;
    prototype.confirmaCarga = confirmaCarga;
    prototype.getRetorno = getRetorno;
    prototype.setRecepcion = setRecepcion;
};




// PRIVATE FUNCTIONS

var _checkRecepcion = function (self, numExpedicion, nombreAgencia, agencia_origen, agencia_destino, agencia_usuario, callback, precargas) {

    var table       = precargas ? 'argos_entregas_webservice' : 'argos_entregas',
        updateQuery = "UPDATE " + table + " " +
            "SET cf_estado =";


    if(agencia_destino == agencia_usuario) {
        var estado = precargas ? self.constants.WebserviceParcelStatus.IN_DESTINATION_WAREHOUSE : self.constants.ParcelStatus.IN_DESTINATION_WAREHOUSE;
        updateQuery+=" "+estado+" WHERE expedicion = "+mysql.escape(numExpedicion)+"";
        self._query(updateQuery, function (error, resultUpdate) {
            if(error) {
                callback(error);
            } else {

                var recepcion_response = {
                    recepcionado        : 1,
                    cf_agencia_destino  : agencia_destino,
                    nombre_agencia      : nombreAgencia,
                    estado              : 'EN ALMACEN DESTINO',
                    cf_estado           : estado
                };

                callback(null, recepcion_response);
            }
        });
    } else if(agencia_origen == agencia_usuario) {

        var estado = precargas ? self.constants.WebserviceParcelStatus.IN_ORIGIN_WAREHOUSE : self.constants.ParcelStatus.IN_ORIGIN_WAREHOUSE;
        updateQuery+=" "+estado+" WHERE expedicion = "+mysql.escape(numExpedicion)+"";
        self._query(updateQuery, function (error, resultUpdate) {
            if(error) {
                callback(error);
            } else {
                var recepcion_response = {
                    recepcionado        : 1,
                    cf_agencia_destino  : agencia_destino,
                    nombre_agencia      : nombreAgencia,
                    estado              : 'EN ALMACEN ORIGEN',
                    cf_estado           : estado
                };

                callback(null, recepcion_response);
            }
        });
    } else {
        var recepcion_response = {
            recepcionado        : 0,
            cf_agencia_destino  : agencia_destino,
            nombre_agencia      : nombreAgencia
        };

        callback(null, recepcion_response);
    }
};
