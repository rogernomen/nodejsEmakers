var mysql = require('mysql');

var readRoutes = function(ids, mode, callback){
	var self = this;
	if(!callback){
        callback = mode;
        mode = false;
    }
    
    // Montamos el array de franjas
    var franjas = [];
    var queryFranjas = 'SELECT id2, descripcion, conf_franja, idioma FROM argos_franjas_entrega WHERE conf_franja != 3';
	this._query(queryFranjas, function(error, results){
		if(error){
			callback(error);
		}else{
			Object.keys(results).forEach(function(key){
				// Pasamo primero por el idioma
				var idioma = results[key].idioma;
				franjas[idioma] = [];
			});
			Object.keys(results).forEach(function(key){
				// Pasamo primero por el idioma
				var idioma = results[key].idioma;
				var conf_franja = results[key].conf_franja;
				franjas[idioma][conf_franja] = [];
			});
			Object.keys(results).forEach(function(key){
				// Pasamo primero por el idioma
				var idioma = results[key].idioma;
				var conf_franja = results[key].conf_franja;
				var id2 = results[key].id2;
				var descripcion = results[key].descripcion;
				franjas[idioma][conf_franja].push({id2 : id2, descripcion : descripcion});
			});
			
			// Define query
		    var queryRoutes = ""+
				"SELECT "+
					"i.id2, "+
					"i.nombre, "+
					"i.cf_estado, "+
					"ei.descripcion AS 'cf_estado_desc', "+
					"i.cf_repartidor, "+
					"r.nombre_repartidor, "+
					"v.cat_vehiculo AS 'tipo_vehiculo', "+
					"DATE_FORMAT(i.fecha_salida, '%Y-%m-%d %H:%i:%s') AS 'fecha_salida', "+
					"DATE_FORMAT(i.fecha_estimada_cierre, '%Y-%m-%d %H:%i:%s') AS 'fecha_estimada_cierre', "+
					"i.hash_dispositivo, "+
					"i.mac_lector "+
				
				"FROM argos_itinerarios AS i "+
					"LEFT JOIN argos_estados_itinerarios AS ei ON (i.cf_estado = ei.id2) "+
					"LEFT JOIN argos_repartidores AS r ON (i.cf_repartidor = r.id2) "+
					"LEFT JOIN argos_vehiculos AS v ON (i.cf_vehiculo = v.id2) "+
				
				"WHERE "+
					"i.ifActiu = 1 AND "+
					"ei.idioma = 1 AND "+
					"i.id2 IN ( "+
			"";
			
			for (var i = 0; i < ids.length; i++){
		        queryRoutes += i == 0 ? mysql.escape(ids[i]) : ',' + mysql.escape(ids[i]);
		    }
		    queryRoutes += ')';
			
			// Query process
			self._query(queryRoutes, function(error, results){
				if(error){
					callback(error);
				}else if(results.length == 0){
					callback(null, []);
				}else{
					// Get parcel list for every route
					Object.keys(results).forEach(function(key){
						if(mode != false && mode.toUpperCase() == 'FULL'){
			        		results[key].mode = 'FULL';
						}else{
							results[key].mode = 'SIMPLE';
						}
					});
					var resultsFinal = [];
					var recursiveGetParcels_by_RouteId = function(Routes_array){
						if(Routes_array.length > 0){
							var route = Routes_array.shift();
							var queryParcels_by_Route = ""+
								"SELECT "+
									"p.id2, "+
									"p.idioma, "+
									"p.expedicion, "+
									"p.cf_recogida_agrupada, "+
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
									"p.conf_franja, "+
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
									"p.cf_itinerario = "+mysql.escape(route.id2)+" "+
								
								"ORDER BY p.orden_itinerario ASC";
		
							self._query(queryParcels_by_Route, function(error, results_parcels){
								if(error){
									callback(error);
								}else{
									// Parse results
									Object.keys(results_parcels).forEach(function(key){
										
										// Swaps addresses on collected returned items
										if(results_parcels[key].cf_tipo_servicio == self.constants.ServiceTypes.RETURN && results_parcels[key].cf_estado != self.constants.ParcelStatus.TO_BE_COLLECTED){
											results_parcels[key].direccion_completa = results_parcels[key].direccion_devo_completa;
											results_parcels[key].direccion_listado = results_parcels[key].direccion_devo_listado;
											results_parcels[key].cf_tipo_via = results_parcels[key].cf_tipo_via_devo;
											results_parcels[key].cf_tipo_via_desc = results_parcels[key].cf_tipo_via_desc_devo;
											results_parcels[key].direccion = results_parcels[key].direccion_devo;
											results_parcels[key].numero = results_parcels[key].numero_devo;
											results_parcels[key].cp = results_parcels[key].cp_devo;
											results_parcels[key].otros_direccion = results_parcels[key].otros_direccion_devo;
											results_parcels[key].localidad = results_parcels[key].localidad_devo;
											results_parcels[key].lat = results_parcels[key].lat_devo;
											results_parcels[key].lon = results_parcels[key].lon_devo;
										}
										
										// Delete useless fields
										delete results_parcels[key].direccion_devo_completa;
										delete results_parcels[key].cf_tipo_via_devo;
										delete results_parcels[key].cf_tipo_via_desc_devo;
										delete results_parcels[key].direccion_devo;
										delete results_parcels[key].numero_devo;
										delete results_parcels[key].cp_devo;
										delete results_parcels[key].otros_direccion_devo;
										delete results_parcels[key].localidad_devo;
										delete results_parcels[key].lat_devo;
										delete results_parcels[key].lon_devo;
										delete results_parcels[key].direccion_devo_listado;
										

										
										var arrayFranjas = [];
										var idioma = results_parcels[key].idioma;
										var conf_franja = results_parcels[key].conf_franja;
										results_parcels[key]['franjas_aplicables'] = franjas[idioma][conf_franja];
										results_parcels[key]['franjas_aplicables'] = results_parcels[key]['franjas_aplicables'].concat(franjas[idioma][0]);
									});
									route.parcel_list = results_parcels;
									resultsFinal.push(route);
									recursiveGetParcels_by_RouteId(Routes_array);
								}
							});
						}else{
							recursiveGetRoutes_by_RECO(resultsFinal, []);
						}
					};
					recursiveGetParcels_by_RouteId(results);

					var recursiveGetRoutes_by_RECO = function(routes_input, routes_output){
						if(routes_input.length > 0){
							var route = routes_input.shift();
							var parcels = route.parcel_list;
							recursiveGetParcels_by_RECO(route, routes_input, routes_output, parcels, []);
						} else {
							callback(null, routes_output);
						}
					}

					var recursiveGetParcels_by_RECO = function(route, routes_input, routes_output, parcels_input, parcels_output){
						if(parcels_input.length > 0){
							var parcel = parcels_input.shift();
							if(parcel.cf_tipo_demanda == self.constants.DemandTypes.GROUPED){
								var queryExpediciones_RECO = "SELECT expedicion FROM argos_entregas_webservice WHERE cf_recogida_agrupada = "+mysql.escape(parcel.id2)+" AND ifActiu != 2";
								console.log(queryExpediciones_RECO);
								self._query(queryExpediciones_RECO, function(error, results_expediciones_RECO){
									if(error){
										callback(error);
									}else{
										parcel['lista_expediciones_RECO'] = results_expediciones_RECO;
										parcels_output.push(parcel);
										recursiveGetParcels_by_RECO(route, routes_input, routes_output, parcels_input, parcels_output);
									}
								});
							}else{
								parcels_output.push(parcel);
								recursiveGetParcels_by_RECO(route, routes_input, routes_output, parcels_input, parcels_output);
							}
						} else {
							route.parcel_list = parcels_output;
							routes_output.push(route);
							recursiveGetRoutes_by_RECO(routes_input, routes_output);
						}
					}
				}
			});
		}
	});
};

var readRoutesDeviceIds = function(ids, callback){
	var query = 'SELECT DISTINCT hash_dispositivo FROM argos_itinerarios WHERE id2 IN ('; 
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

module.exports = function(prototype){
    prototype.readRoutes = readRoutes;
    prototype.readRoutesDeviceIds = readRoutesDeviceIds;
};
