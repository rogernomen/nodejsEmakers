var mysql = require('mysql');
var basicAuth = require('basic-auth');

var databaseOptions = {
    host : '192.168.1.45',
    port : 3306,
    connectionLimit : 10,
    user : 'emakers',
    password : 'emakers2014',
    database : 'argos_emakers'
};

/**
A class for the the Emakers API to access its MySQL database.

@example
To use the class include the module and create a Database object:

    var database = new require('emakers-api-mysql');

@class Database
@constructor
**/
var Database = function(){
    self = this;
    self.pool = mysql.createPool(databaseOptions);
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
Send a JSON response with a 401 status code (Unauthorized).
 
@method _send401
@param {Object} response The Express framework response object.
@private
**/
Database.prototype._send401 = function(response){
    response.statusCode = 401;
    response.setHeader('WWW-Authenticate', 'Basic realm="emakers-api"');
    response.json({error : "Authorization required"});
};

/**
Send a JSON response with a 500 status code (Internal server error).
 
@method _send500
@param {Object} response The Express framework response object.
@param {String} error The error message to put in the response body.
@private
**/
Database.prototype._send500 = function(response, error){
    response.statusCode = 500;
    response.json({error : error});
};


/**
Middleware function for the Express framework that authenticates a user.
If the credentials are correct it will populate response.locals.user with the user data and continue with the next middleware.
If not, it will send a JSON response with an error.

@method authenticate
@param {Object} request The Express framework request object.
@param {Object} response The Express framework response object.
@param {function} next The next middleware function in the chain.
**/
Database.prototype.authenticate = function(request, response, next){
    var self = this;
    var user = basicAuth(request);
    if (!user || !user.name || !user.pass){
        self._send401(response);
    } else {
        self.pool.getConnection(function(error, connection){
            if (error){
                self._send500(response, error);
            } else {
                connection.query('select * from argos_repartidores where login_dispo=? and psw_dispo=?', [user.name, user.pass], function(error, rows, fields){
                    if (error){
                        self._send500(response, error);
                    } else if (rows.length == 0){
                        self._send401(response);
                    } else {
                        response.locals.user = {
                            id : rows[0].id_repartidores,
                            agency : rows[0].cf_agencia
                        };
                        connection.release();
                        next();
                    }
                });
            }
        });
    }
};

Database.prototype.getCities = function(request, response, next){
    var self = this;
    self.pool.getConnection(function(error, connection){
        if (error) {
            self._send500(response, error);
        } else {
            connection.query('select * from argos_ciudades', function(error, rows, fields){
                if (error){
                    self._send500(response, error);
                } else {
                    var cities = new Array();
                    for (var i = 0; i < rows.length; i++){
                        var row = rows[i];
                        cities.push({
                            id : row.id_ciudad,
                            code : row.codigo_ciudad,
                            name : row.descripcion
                        });
                    }
                    response.json(cities);
                }
                connection.release();
            });
        }
    });
};

module.exports = Database;
