var mysql = require('mysql');
var basicAuth = require('basic-auth');

var readAgenciesData = function(ids, callback){
    var query = ""+
    	"SELECT "+
    		"id2, "+
    		"nombre_agencia, "+
    		"CONCAT(direccion, ' ', numero, ' ', cp, ' ', localidad) AS 'direccion_agencia', "+
    		"lat_agencia AS 'lat', "+
    		"lon_agencia AS 'lon', "+
    		"telf_almacen, "+
    		"correo_almacen "+
    	"FROM argos_agencias ";
    if (!callback){
        callback = ids;
    } else {
        query += "WHERE id2 IN (";
        for (var i = 0; i < ids.length; i++){
            query += i == 0 ? mysql.escape(ids[i]) : ',' + mysql.escape(ids[i]);
        }
        query += ")";
    }
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

module.exports = function(prototype){
    prototype.readAgenciesData = readAgenciesData;
};
