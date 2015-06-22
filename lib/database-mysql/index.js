var mysql = require('mysql');

// Options for the database connection.
var databaseOptions = {};

// DB options for cristobal@toomanymelons.com local setup.
databaseOptions['cva_localhost.emks.net'] = {
    host : 'localhost',
    port : 3306,
    connectionLimit : 10,
    user : 'emakers',
    password : 'emakers2014',
    database : 'argos_emakers'
};

// DB options for david@emakers.es local setup.
databaseOptions['localhost'] = {
    socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
    connectionLimit : 10,
    user : 'root',
    password : 'root',
    database : 'argos_emakers'
};

// DB options for production environment.
databaseOptions['emks.net'] = {
    host : 'localhost',
    port : 3306,
    connectionLimit : 10,
    user : 'argos_userbd',
    password : 'hLb8B}8XU8rtAEj',
    database : 'argos_emakers'
};

// DB options for production test environment.
databaseOptions['test.emks.net'] = {
    host : 'localhost',
    port : 3306,
    connectionLimit : 10,
    user : 'argos_userbd_tes',
    password : 'hLb8B}8XU8rtAEj',
    database : 'argos_emakers_test'
};

// DB options for development environment.
databaseOptions['bcn.emks.net'] = {
    host : '192.168.1.44',
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

Database.prototype._buildQuery = function(query, filter, sort, like, limit){
	
	var fields = [];
	var values = [];
	
	if(filter){
		Object.keys(filter).forEach(function(key){
			fields.push(key);
			values.push(filter[key]);
		});
	
		if(fields.length > 0){
			query += " WHERE ";
			for(var k = 0; k < fields.length; k++){
				query += mysql.escapeId(fields[k]) + " = "+mysql.escape(values[k]);
				if(k < fields.length-1){
					query += " AND ";
				}
			}
		}
	}
	
	if(like){
		if(fields.length > 0){
			query += " AND ";
		}else{
			query += " WHERE ";
		}
		fields = [];
		values = [];
		Object.keys(like).forEach(function(key){
			fields.push(key);
			values.push('%'+like[key]+'%');
		});
		
		if(fields.length > 0){
			for(var k = 0; k < fields.length; k++){
				query += mysql.escapeId(fields[k]) + " LIKE "+mysql.escape(values[k]);
				if(k < fields.length-1){
					query += " AND ";
				}
			}
		}
	}
	
	if(sort){
		fields = [];
		values = [];
		Object.keys(sort).forEach(function(key){
			if(sort[key].toUpperCase() == 'ASC' || sort[key].toUpperCase() == 'DESC'){
				fields.push(key);
				values.push(sort[key]);
			}
		});
		
		if(fields.length > 0){
			query += " ORDER BY ";
			for(var k = 0; k < fields.length; k++){
				query += mysql.escapeId(fields[k]) + " "+values[k].toUpperCase();
				if(k < fields.length-1){
					query += ", ";
				}
			}
		}
	}
	
	if(limit && limit.count){
		if(limit.offset){
			query += " LIMIT "+parseInt(limit.offset)+", "+parseInt(limit.count);
		}else{
			query += " LIMIT "+parseInt(limit.count);
		}
	}

	return query;
};

Database.prototype._isInteger = function(x){
	return (typeof x === 'number') && (x % 1 === 0);
}

Database.prototype.constants = require('./constants');

require('./authenticate')(Database.prototype);
require('./cities')(Database.prototype);
require('./couriers')(Database.prototype);
require('./routes')(Database.prototype);
require('./parcels')(Database.prototype);
require('./drivers')(Database.prototype);
require('./agencies')(Database.prototype);

module.exports = Database;
