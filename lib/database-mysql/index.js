var mysql = require('mysql');

// Options for the database connection.
var databaseOptions = {};

// DB options for david@emakers.es local setup.
databaseOptions['localhost'] = {
    socketPath : '',
    connectionLimit : 10,
    user : 'root',
    password : 'root',
    database : 'argos_emakers'
};

// DB options for cristobal@toomanymelons.com local setup.
databaseOptions['cva.emks.net'] = {
    host : 'localhost',
    port : 3306,
    connectionLimit : 10,
    user : 'emakers',
    password : 'emakers2014',
    database : 'argos_emakers'
};

// DB options for production environment.
databaseOptions['emks.net'] = {
    host : 'emakers-db',
    port : 3306,
    connectionLimit : 10,
    user : 'argos_userbd',
    password : 'hLb8B}8XU8rtAEj',
    database : 'argos_emakers'
};

// DB options for development environment.
databaseOptions['bcn.emks.net'] = {
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
var Database = function(hostname){
    if (databaseOptions[hostname]){
        this.pool = mysql.createPool(databaseOptions[hostname]);
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
    } else {
        console.log('No DB configuration available for hostname \'' + hostname + '\' in \'' + __filename + '\', exiting.');
        process.exit();
    }
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
                callback(error, rows);
            });
        }
    });
};

require('./authenticate')(Database.prototype);
require('./cities')(Database.prototype);
require('./couriers')(Database.prototype);

module.exports = Database;
