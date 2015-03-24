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
				"DATE_FORMAT(p.fecha_alta, '%d/%m/%Y %H:%i:%s') AS 'fecha_alta', "+
				"DATE_FORMAT(p.fecha_entrega_cliente, '%d/%m/%Y') AS 'fecha_entrega_cliente', "+
				"DATE_FORMAT(p.fecha_entrega_prevista, '%d/%m/%Y %H:%i:%s') AS 'fecha_entrega_prevista', "+
				"DATE_FORMAT(p.fecha_entrega_estimada_inf, '%d/%m/%Y %H:%i:%s') AS 'fecha_entrega_estimada_inf', "+
				"DATE_FORMAT(p.fecha_entrega_estimada_sup, '%d/%m/%Y %H:%i:%s') AS 'fecha_entrega_estimada_sup', "+
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
				"DATE_FORMAT(p.fecha_alta, '%d/%m/%Y %H:%i:%s') AS 'fecha_alta', "+
				"DATE_FORMAT(p.fecha_entrega_cliente, '%d/%m/%Y') AS 'fecha_entrega_cliente', "+
				"DATE_FORMAT(p.fecha_entrega_prevista, '%d/%m/%Y %H:%i:%s') AS 'fecha_entrega_prevista', "+
				"DATE_FORMAT(p.fecha_entrega_estimada_inf, '%d/%m/%Y %H:%i:%s') AS 'fecha_entrega_estimada_inf', "+
				"DATE_FORMAT(p.fecha_entrega_estimada_sup, '%d/%m/%Y %H:%i:%s') AS 'fecha_entrega_estimada_sup', "+
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
			});
			callback(null, results);
		}
	});
}

module.exports = function(prototype){
    prototype.readParcels = readParcels;
};
