var mysql = require('mysql');
var basicAuth = require('basic-auth');
/**
Query the database to find all the data for the specified cities.
 
@method readCities
@param {Array} [ids] Return only the cities with those ids.
@param {function(error, cities} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.cities An array with all the cities found.
**/
var readDrivers = function(ids, callback){
    var query = 'select * from argos_repartidores';
    if (!callback){
        callback = ids;
    } else {
        query += ' where id2 in (';
        for (var i = 0; i < ids.length; i++){
            query += i == 0 ? mysql.escape(ids[i]) : ',' + mysql.escape(ids[i]);
        }
        query += ')';
    }
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            var drivers = [];
            for (var i = 0; i < results.length; i++){
                var result = results[i];
                drivers.push({
                    id: result.id2
                });
            }
            callback(null, drivers);
        }
    });
};

var readAvatarDriver = function(ids, callback){
	var query = "SELECT id2, img_repartidor_base64 AS 'img_blob', CONVERT(img_repartidor_base64 USING utf8) AS 'img_base64' FROM argos_repartidores";
	if (!callback){
        callback = ids;
    } else {
        query += ' WHERE id2 IN (';
        for (var i = 0; i < ids.length; i++){
            query += i == 0 ? mysql.escape(ids[i]) : ',' + mysql.escape(ids[i]);
        }
        query += ')';
    }
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

var readUnfinishedRoutes = function(ids, callback){
	var query = "SELECT id2 AS 'id_itinerario' FROM argos_itinerarios WHERE ifActiu = 1 AND cf_estado IN ("+this.constants.RouteStatus.READY+","+this.constants.RouteStatus.IN_COURSE+") AND ";
	if (!callback){
        callback = ids;
    } else {
        query += 'cf_repartidor IN (';
        for (var i = 0; i < ids.length; i++){
            query += i == 0 ? mysql.escape(ids[i]) : ',' + mysql.escape(ids[i]);
        }
        query += ')';
    }
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

var updateDriverLogin = function(request, response, callback){
	console.log(this.constants);
	// update routes of the driver
	var queryUpdate = ""+
		"UPDATE argos_itinerarios SET "+
			"telf_repartidor = "+mysql.escape(request.body.telf_repartidor)+", "+
			"hash_dispositivo = "+mysql.escape(request.body.hash_dispositivo)+", "+
			"mac_lector = "+mysql.escape(request.body.mac_lector)+" "+
		"WHERE "+
			"cf_repartidor = "+mysql.escape(response.locals.user.id)+" AND "+
			"ifActiu = 1 AND "+
			"cf_estado IN ("+this.constants.RouteStatus.READY+","+this.constants.RouteStatus.IN_COURSE+")";
			
	this._query(queryUpdate, function(error, resultUpdate){
        if (error){
            callback(error);
        } else {
            callback(null, response.locals.user);
        }
    });
};

var readDriversDeviceIds = function(ids, callback){
	var query = 'SELECT DISTINCT hash_dispositivo FROM argos_repartidores WHERE id2 IN ('; 
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
    prototype.readDrivers = readDrivers;
    prototype.readAvatarDriver = readAvatarDriver;
    prototype.readUnfinishedRoutes = readUnfinishedRoutes;
    prototype.updateDriverLogin = updateDriverLogin;
    prototype.readDriversDeviceIds = readDriversDeviceIds;
};
