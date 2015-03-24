var mysql = require('mysql');

/**
Query the database to authenticate a user.

@method authenticate
@param {String} username The user name.
@param {String} password The user password.
@param {function(error, user} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.user Object that contains all the properties of the authenticated user. Present only if the user was found, null otherwise.
**/
var authenticate = function(username, password, callback){
    var query = 'select id2,cf_agencia, idioma, nombre_repartidor from argos_repartidores where login_dispo=' + mysql.escape(username) + ' and psw_dispo=' + mysql.escape(password);
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else if (results.length == 0){
            callback();
        } else {
            callback(null, {
                id: results[0].id2,
                agency: results[0].cf_agencia,
                idioma: results[0].idioma,
                nombre_repartidor: results[0].nombre_repartidor
            });
        }
    });
};

module.exports = function(prototype){
    prototype.authenticate = authenticate;
};
