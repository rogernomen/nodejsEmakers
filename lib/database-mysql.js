var mysql = require('mysql');

// Options for the database connection.
var databaseOptions = {
    host : '192.168.1.45',
    port : 3306,
    connectionLimit : 10,
    user : 'emakers',
    password : 'emakers2014',
    database : 'argos_emakers'
};

/**
A class for the Emakers API to access its MySQL database.

@example
To use the class include this file and create a Database object.

    var Database = require('path/database-mysql');
    var database = new Database();

@class Database
@constructor
**/
var Database = function(){
    this.pool = mysql.createPool(databaseOptions);
    self = this;
    var cleanupAndExit = function(){
        self.pool.end(function(error){
            process.exit();
        });
    };
    process.on('SIGINT', function(){
        cleanupAndExit();
    });
    process.on('SIGTERM', function(){
        cleanupAndExit();
    });
    process.on('uncaughtException', function(exception){
        console.log('Uncaught exception: ' + exception.stack);
        cleanupAndExit();
    });
};

/**
Generic function to perform any SQL statement.

@method _query
@private
@param {String} query The SQL query. To build it you can use mysql.escape(string) to append identifiers and values to the query.
@param {function(error, results)} callback Function to call when done. Has the following parameters:
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Array, Object} callback.results If the query is a select, an array of objects with the rows found. If it's an insert, update or delete, an object whose affectedRows property indicates the number of rows affected by the query.
**/
Database.prototype._query = function(query, callback){
    this.pool.getConnection(function(error, connection){
        if (error){
            callback(error);
        } else {
            connection.query(query, function(error, rows, columns){
                connection.release();
                rows = rows || [];
                callback(error, rows);
            });
        }
    });
};


/**
Query the database to authenticate a user.

@method authenticate
@param {String} username The user name.
@param {String} password The user password.
@param {function(error, user} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.user Object that contains all the properties of the authenticated user. Present only if the user was found, null otherwise.
**/
Database.prototype.authenticate = function(username, password, callback){
    var query = 'select * from argos_repartidores where login_dispo=' + mysql.escape(username) + ' and psw_dispo=' + mysql.escape(password);
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else if (results.length == 0){
            callback();
        } else {
            callback(null, {
                id : results[0].id_repartidores,
                agency : results[0].cf_agencia
            });
        }
    });
};

/**
Query the database to find all the data for the specified cities.
 
@method readCities
@param {Array} [ids] Return only the cities with those ids.
@param {function(error, cities} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.cities An array with all the cities found.
**/
Database.prototype.readCities = function(ids, callback){
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
            callback(null, cities);
        }
    });
};

/**
Add new cities to the database.
 
@method createCities
@param {Array} cities The array of cities to create. Each one must have at least an id property, the rest are optional.
@param {function(error, cities} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.cities An array with all the cities created.
**/
Database.prototype.createCities = function(cities, callback){
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
            var createdCities = [];
            for (var i = 0; i < cities.length; i++){
                var city = cities[i];
                createdCities.push({
                    id : city.id,
                    code : city.code,
                    name : city.name
                });
            }
            callback(null, createdCities);
        }
    });
};

/**
Modify a city.
 
@method updateCity
@param {Object} The city to modify. Must have an id property that indicates what city to update, and at least another property to update.
@param {function(error, results} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.results An object with the result of the query.
@param {Number} callback.results.updated A 1 if the city was updated or a 0 if not.
**/
Database.prototype.updateCity = function(city, callback){
    var query = 'update argos_ciudades SET ';
    query += city.code ? 'codigo_ciudad=' + mysql.escape(city.code) + ',' : '';
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
Delete cities.
 
@method deleteCities
@param {Array} The cities ids to delete.
@param {function(error, results} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.results An object with the result of the query.
@param {Number} callback.results.deleted Indicates how many cities where deleted.
**/
Database.prototype.deleteCities = function(ids, callback){
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

module.exports = Database;
