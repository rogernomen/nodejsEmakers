var mysql = require('mysql');

/**
Query the database to find all the data for the specified cities.
 
@method readCities
@param {Array} [ids] Return only the cities with those ids.
@param {function(error, cities} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.cities An array with all the cities found.
**/
var readCities = function(ids, callback){
    var query = 'select * from argos_ciudades';
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
                    id : result.id2,
                    code : result.codigo_ciudad,
                    name : result.descripcion
                });
            }
            callback(null, {cities: cities});
        }
    });
};

/**
Add new cities to the database.
 
@method createCities
@param {Array} cities The array of cities to create. Each one must have at least an id property, the rest are optional.
@param {function(error, results} callback The function to call when done.
@param {Object} callback.results An object with the result of the query.
@param {Number} callback.results.created How many cities where created.
**/
var createCities = function(cities, callback){
    var query = 'insert into argos_ciudades (id2,codigo_ciudad,descripcion) values ';
    for (var i = 0; i < cities.length; i++){
        query += i == 0 ? '(' : ',(';
        query += cities[i].id + ',';
        query += (cities[i].code ? mysql.escape(cities[i].code) : 'DEFAULT') + ',';
        query += (cities[i].name ? mysql.escape(cities[i].name) : 'DEFAULT') + ')';
    }
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, {created : results.affectedRows});
        }
    });
};

/**
Partially modify 1 city.
 
@method updateCity
@param {Object} The city to modify. It must have an id property that indicates what city to update, and at least another property to update.
@param {function(error, results} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.results An object with the result of the query.
@param {Number} callback.results.updated How many cities where updated, 0 or 1.
**/
var updateCity = function(city, callback){
    var query = 'update argos_ciudades set ';
    query += city.code ? 'codigo_ciudad=' + mysql.escape(city.code) : '';
    query += city.code && city.name ? ',' : '';
    query += city.name ? 'descripcion=' + mysql.escape(city.name) : '';
    query += ' where id2=' + mysql.escape(city.id);
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, {updated : results.affectedRows});
        }
    });
};

/**
Completely replace 1 city.
 
@method replaceCity
@param {Object} The city to replace. It one must have at least an id property, the rest are optional.
@param {function(error, results} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.results An object with the result of the query.
@param {Number} callback.results.updated How many cities where updated, 0 or 1.
**/
var replaceCity = function(city, callback){
    var query = 'update argos_ciudades set ';
    query += 'codigo_ciudad=' + (city.code ? mysql.escape(city.code) : 'DEFAULT');
    query += city.code && city.name ? ',' : '';
    query += 'descripcion=' + (city.name ? mysql.escape(city.name) : 'DEFAULT');
    query += ' where id2=' + mysql.escape(city.id);
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, {updated : results.affectedRows});
        }
    });
};

/**
Delete cities.
 
@method deleteCities
@param {Array} The cities ids to delete.
@param {function(error, results} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.results An object with the result of the query.
@param {Number} callback.results.deleted Indicates how many cities where deleted.
**/
var deleteCities = function(ids, callback){
    var query = 'delete from argos_ciudades where id2 in (';
    for (var i = 0; i < ids.length; i++){
        query += i == 0 ? mysql.escape(ids[i]) : ',' + mysql.escape(ids[i]);
    }
    query += ')';
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, {deleted : results.affectedRows});
        }
    });
};

module.exports = function(prototype){
    prototype.readCities = readCities;
    prototype.createCities = createCities;
    prototype.updateCity = updateCity;
    prototype.replaceCity = replaceCity;
    prototype.deleteCities = deleteCities;
};
