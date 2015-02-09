var mysql = require('mysql');

var readRoutes = function(filter, like, sort, limit, callback){
	var query = "SELECT * FROM argos_itinerarios";
	query = this._buildQuery(query, filter, sort, like, limit);
	console.log(query);
	this._query(query, function(error, results){
		if(error){
			callback(error);
		}else{
			callback(null, results);
		}
	});
}

module.exports = function(prototype){
    prototype.readRoutes = readRoutes;
};
