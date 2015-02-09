var mysql = require('mysql');

/**
Query the database to find all the data for the specified couriers.
 
@method readCouriers
@param {Array} [ids] Return only the couriers with those ids.
@param {function(error, couriers} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.couriers An array with all the couriers found.
**/
var readCouriers = function(ids, callback){
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
            var couriers = [];
            for (var i = 0; i < results.length; i++){
                var result = results[i];
                couriers.push({
                    id : result.id2,
                    agency : result.cf_agencia,
                    name : result.nombre_repartidor,
                    email : result.mail_repartidor,
                    personalPhone : result.telf_repartidor,
                    companyPhone : result.telf_dispo,
                    gcmDeviceId : result.gcm_id_dispo
                });
            }
            callback(null, {couriers: couriers});
        }
    });
};

/**
Login a courier. Writes the phone number and gcm device id on the DB and returns the courier id.

@method loginCourier
@param {Number} courierId The courier id.
@param {String} phoneNumber The company phone the courier is carrying today.
@param {String} gcmDeviceId The Google Cloud Messaging the device is registered as.
@param {function(error, results} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.results An object with the result of the query.
@param {Boolean} callback.results.updated If the courier was updated in the DB.
@param {Number} callback.results.courierId The courier unique id for future queries.
**/
var loginCourier = function(courierId, phoneNumber, gcmDeviceId, callback){
    var query = 'update argos_repartidores set telf_dispo=' + mysql.escape(phoneNumber) + ',gcm_id_dispo=' + mysql.escape(gcmDeviceId) + ' where id2=' + mysql.escape(courierId);
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, {
                updated : results.affectedRows > 0,
                courierId : courierId
            });
        }
    });
};

/**
Logout a courier. Cleans the company phone number and gcm device id from the DB.

@method logoutCourier
@param {Number} courierId The courier id.
@param {function(error, results} callback The function to call when done.
@param {Object} callback.error Present only if there is an error, null otherwise.
@param {Object} callback.results An object with the result of the query.
@param {Boolean} callback.results.updated If the courier was updated in the DB.
**/
var logoutCourier = function(courierId, callback){
    var query = 'update argos_repartidores set telf_dispo=DEFAULT,gcm_id_dispo=DEFAULT where id2=' + mysql.escape(courierId);
    this._query(query, function(error, results){
        if (error){
            callback(error);
        } else {
            callback(null, {
                updated : results.affectedRows > 0,
                courierId : courierId
            });
        }
    });
};

module.exports = function(prototype){
    prototype.readCouriers = readCouriers;
    prototype.loginCourier = loginCourier;
    prototype.logoutCourier = logoutCourier;
};
