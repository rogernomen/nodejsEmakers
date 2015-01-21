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

    var Database = require('emakers-api-database-mysql');
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
@param {String} query The SQL query, with ?? for id placeholders and ? for values placeholders.
@param {Array} values An array of strings to put in the query placeholders, in order. Pass an empty array if there are none.
@param {function(error, results)} callback Function to call when done. Has the following parameters:
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Array} callback.results An array of objects, where each object is one of the rows returned by the query. If there are no results the array will be empty.
**/
Database.prototype._query = function(query, values, callback){
    this.pool.getConnection(function(error, connection){
        if (error){
            callback(error);
        } else {
            connection.query(query, values, function(error, rows, columns){
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
    this._query('select * from argos_repartidores where login_dispo=? and psw_dispo=?', [username, password], function(error, results){
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
@param {Object} [options] Limit the cities returned to those that match the properties on this object.
@param {String} [options.id] Find only cities with this id.
@param {String} [options.code] Find only cities with this code.
@param {String} [options.name] Find only cities with this name.
@param {function(error, cities} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.cities An array with all the cities found that match the criteria in the options.
**/
Database.prototype.readCities = function(options, callback){
    if (!callback){
        callback = options;
        options = {};
    }
    var query = 'select * from argos_ciudades';
    var values = [];
    if (options.id){
        values.push('id2', options.id);
    }
    if (options.code){
        values.push('codigo_ciudad', options.code);
    }
    if (options.name){
        values.push('descripcion', options.name);
    }
    for (var i = 0; i < values.length; i += 2){
        query += (i == 0) ? ' where ?? = ?' : ' and ?? = ?';
    }
    this._query(query, values, function(error, results){
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

Database.prototype.createCity = function(city, callback){
    this._query('insert into argos_ciudades (id2, codigo_ciudad, descripcion) values (?,?,?)', [city.id, city.code, city.name], callback);
};

Database.prototype.updateCity = function(city, callback){
    var query = 'update argos_ciudades SET';
    var values = [];
    if (city.code){
        query += ' codigo_ciudad = ?';
        values.push(city.code);
    }
    if (city.name){
        if (city.code){
            query += ' ,';
        }
        query += ' descripcion = ?';
        values.push(city.name);
    }
    query += ' where id2 = ?';
    values.push(city.id);
    this._query(query, values, callback);
};

Database.prototype.deleteCity = function(city, callback){
    this._query('delete from argos_ciudades where id2 = ?', [city.id], callback);
};

module.exports = Database;
