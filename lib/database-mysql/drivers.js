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
            var cities = [];
            for (var i = 0; i < results.length; i++){
                var result = results[i];
                cities.push({
                    id: result.id2,
                    code: result.codigo_ciudad,
                    name: result.descripcion
                });
            }
            callback(null, {cities: cities});
        }
    });
};

var updateDriverLogin = function(request, response, callback){
	// update routes of the driver
	var queryUpdate = ""+
		"UPDATE argos_itinerarios SET "+
			"telf_repartidor = "+mysql.escape(request.body.telf_repartidor)+", "+
			"hash_dispositivo = "+mysql.escape(request.body.hash_dispositivo)+", "+
			"mac_lector = "+mysql.escape(request.body.mac_lector)+" "+
		"WHERE "+
			"cf_repartidor = "+mysql.escape(response.locals.user.id)+" AND "+
			"ifActiu = 1 AND "+
			"cf_estado IN (2,3,4)";
			
	this._query(queryUpdate, function(error, resultUpdate){
        if (error){
            callback(error);
        } else {
            callback(null, response.locals.user);
        }
    });
};

module.exports = function(prototype){
    prototype.readDrivers = readDrivers;
    prototype.updateDriverLogin = updateDriverLogin;
};
