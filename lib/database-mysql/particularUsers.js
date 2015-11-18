var mysql = require('mysql');
var basicAuth = require('basic-auth');
var async   = require('async');


var getUserByEmail = function (email, callback) {
      var me        = this,
          query     = "SELECT * FROM argos_usuarios_particulares WHERE email = '"+email+"'";

    me._query(query, function (error, data) {
        if(error) {
            callback(error);
        } else if(typeof data[0] !== "undefined" && typeof data[0].email != ""){
            callback(null, data[0]);
        } else {
            callback({'status' : 404});
        }
    });
};

var setUserRecoveryPasswordHash = function (user, callback) {
    var me      = this,
        hash    = new Date().getTime() + 10,
        query   = "UPDATE argos_usuarios_particulares SET recoveryPasswordHash = '"+hash+"' WHERE id = "+user.id;

    me._query(query, function (error, data) {
        if(error) {
            callback(error);
        } else {
            callback(null, hash);
        }
    });
};

var login = function(user, pass, callback){
    var me = this;
    var query = "SELECT id, email FROM argos_usuarios_particulares WHERE email = '"+user+"' AND password = PASSWORD('"+pass+"')";

    me._query(query, function(error, userData){
        if (error){
            callback(error);
        } else {
            console.log(userData);
            if(typeof userData[0] !== 'undefined' && typeof userData[0].email !== 'undefined') {
                me.userId = userData[0].id;
                var query2 = "UPDATE argos_usuarios_particulares SET secretHash = md5(concat('"+userData[0].email+"', now())) WHERE id = '"+userData[0].id+"'";
                me._query(query2, function (error, result) {
                    if(result.affectedRows == 1) {
                        var query3 = "SELECT CONCAT(nombre, ' ',apellidos) AS nombre, secretHash, id FROM argos_usuarios_particulares WHERE id = '"+me.userId+"'";
                        me._query(query3, function (error, userObject) {
                            if(error) {
                                callback(error);
                            } else {
                                callback(null, userObject);
                            }
                        });
                    } else {
                        callback(error);
                    }
                });
            } else {
                callback(error);
            }
        }
    });
};

var getUserAddresses = function (secretHash, callback) {
    var query = "SELECT * FROM argos_usuarios_particulares_direcciones AS aupd " +
        "LEFT JOIN argos_usuarios_particulares AS aup ON aup.id = aupd.cf_usuarios_particulares" +
        " WHERE secretHash = '"+secretHash+"'";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

var getUser = function (userId, userHash, callback) {
    var query = "SELECT * FROM argos_usuarios_particulares WHERE id = "+userId +
            " AND secretHash = '"+userHash+"'";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

var updateUser = function (userObj, callback) {
    var query = "UPDATE argos_usuarios_particulares " +
        "SET nombre = '"+userObj.userName+"', " +
        "apellidos = '"+userObj.userSurnames+"', " +
        "telefono = '"+userObj.userPhone+"', " +
        "nif = '"+userObj.userNif+"', " +
        "email = '"+userObj.userEmail+"' " +
        "WHERE id = "+userObj.userId;

    this._query(query, function (error, results) {
        if(error) {
            callback(error)
        } else {
            callback(null, results);
        }
    });
};

var getUserOrder = function (userId, callback) {
    var me      = this,
        query   = "SELECT ae.*, aee.descripcion as descripcion FROM argos_entregas AS ae " +
        "LEFT JOIN argos_estados_entregas AS aee ON aee.id2 = ae.cf_estado " +
        "WHERE aee.idioma = 1 AND " +
        " ae.id_usuario_particular = "+userId;
    me.recos            = [];
    me.recos.entregas   = [];

    me._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            async.forEach(results, function (order, callback){
                var query2 = "SELECT * FROM argos_entregas_webservice AS aew " +
                    "INNER JOIN argos_estados_entregas AS aee ON aew.cf_estado = aee.id2 "+
                    " WHERE aew.cf_recogida_agrupada = "+order.id2 +
                    " AND aew.ifActiu = 1 " +
                    "GROUP BY aew.expedicion";
                me._query(query2, function (error, results) {
                    order.entregas = [];
                    order.entregas.push(results);

                    var query3 = "SELECT * FROM argos_entregas AS ae " +
                        "INNER JOIN argos_estados_entregas AS aee ON ae.cf_estado = aee.id2 "+
                        " WHERE ae.cf_recogida_agrupada = "+order.id2 +
                        " AND ae.ifActiu = 1 " +
                        "GROUP BY ae.expedicion";

                    me._query(query3, function (error, results2) {
                        async.forEach(results2, function (entregas, callback) {
                            order.entregas[0].push(entregas);
                            callback();
                        });
                        callback(); // tell async that the iterator has completed
                    });

                });



            }, function(err) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, results);
                }
            });
        }
    });
};

var isCpInAgencyCover = function (cp, callback) {
    var query = "SELECT cf_agencia FROM argos_agencias_cp WHERE cp = '"+cp+"' ";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            if(results.length > 0) {
                callback(null, results[0].cf_agencia);
            } else {
                callback(null, 0);
            }
        }
    });
};

var getAgencyCpZone = function (cpDestino, agencyId, callback) {
    var twoFirstDigitsCp = cpDestino.substr(0,2);

    var query = "SELECT id_grupo_zona,zona FROM argos_agencias_zonas WHERE cp = '"+twoFirstDigitsCp+"' AND cf_agencia = "+agencyId+" ";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            if(results.length > 0) {
                callback(null, results[0]);
            } else {
                callback(null, null);
            }
        }
    });
};

var getZonaNacional = function (cpOrigen, cpDestino, callback) {
    cpOrigen    = cpOrigen.substr(0,2);
    cpDestino   = cpDestino.substr(0,2);

    var query = "SELECT cf_zona, zona_descripcion FROM argos_agencias_zonas_nacionales WHERE cp_origen = '"+cpOrigen+"'" +
        " AND cp_destino = '"+cpDestino+"' ";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

var getValorSeguro = function (valorSeguro, callback) {
    var query = "SELECT valor, valor2 FROM argos_abonados_precios_extras WHERE cf_abonados_tipos_extras = 8 AND cf_abonado = 294";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            callback(null, results[0]);
        }
    })
};

var savePersonalAddress = function (address, callback) {
    var query   = "SELECT id, email FROM argos_usuarios_particulares WHERE secretHash = '"+address.userHash+"'",
        me      = this;

    me._query(query, function (error, results) {
        if (error) {
            callback(error);
        } else {
            var userId  = results[0].id,
                query2  = "INSERT INTO argos_usuarios_particulares_direcciones (cf_usuarios_particulares, direccion, cp, numero, piso, poblacion, provincia)" +
                    "VALUES ("+userId+", '"+address.addressName+"', '"+address.addressCp+"', '"+address.addressNumber+"', '"+address.adressFloor+"', '"+address.addressPoblacion+"', '"+address.addressProvincia+"')";

            me._query(query2, function (error, results) {
                if(error) {
                    callback(error);
                } else {
                    callback(null, null);
                }
            });
        }
    });
};

var deleteAddress = function (secretHash, address, callback) {
    var query   = "SELECT id, email FROM argos_usuarios_particulares WHERE secretHash = '"+secretHash+"'",
        me      = this;

    me._query(query, function (error, results) {
        if (error) {
            callback(error);
        } else {
            var userId  = results[0].id,
                query2  = "DELETE FROM argos_usuarios_particulares_direcciones WHERE id_direcciones = "+address.id_direcciones+" " +
                    "AND cf_usuarios_particulares = "+userId;

            me._query(query2, function (error, results) {
                if(error) {
                    callback(error);
                } else {
                    callback(null, null);
                }
            });
        }
    });
};

var savePreferences = function (secretHash, preferences, callback) {
    var query   = "SELECT id, email FROM argos_usuarios_particulares WHERE secretHash = '"+secretHash+"'",
        me      = this;

    me._query(query, function (error, results) {
        if (error) {
            callback(error);
        } else {
            var userId = results[0].id;
            async.forEach(preferences, function (preference,  callback){
                var horario1_ini = preference.horario1_ini == null ? '' : preference.horario1_ini,
                    horario1_end = preference.horario1_end == null ? '' : preference.horario1_end,
                    horario2_ini = preference.horario2_ini == null ? '' : preference.horario2_ini,
                    horario2_end = preference.horario2_end == null ? '' : preference.horario2_end,
                    telefono     = preference.telefono == null ? '' : preference.telefono;


                var query2 = "UPDATE argos_usuarios_particulares_preferencias " +
                    "SET cf_direccion = '"+preference.cf_direccion+"' , " +
                    "cf_franja = '"+preference.cf_franja+"', " +
                    "horario1_ini = '"+horario1_ini +"', " +
                    "horario1_end = '"+horario1_end+"', " +
                    "horario2_ini = '"+horario2_ini+"' , " +
                    "horario2_end = '"+horario2_end+"', " +
                    "telefono = '"+telefono+"', " +
                    "ifSmsMismoDia = "+preference.ifSmsMismoDia+ ", "+
                    "ifAvisoDiaAntes = "+preference.ifAvisoDiaAntes+", " +
                    "ifAvisoAusencia = "+preference.ifAvisoAusencia+", " +
                    "ifAvisoError = "+preference.ifAvisoError+", " +
                    "acceptDelivery = "+preference.acceptDelivery+" " +
                    "WHERE dia = '"+preference.dia+"' " +
                    "AND cf_usuario_particular = '"+userId+"'";

                me._query(query2, function (error, result) {
                    if(error) {
                        callback(error);
                    } else {
                        callback();
                    }
                });


            }, function(err) {
                if(err) {
                    callback(err);
                } else {
                    callback(null, null);
                }
            });
        }
    });
};

var insertAddress = function (secretHash, address, callback) {
    var query   = "SELECT id, email FROM argos_usuarios_particulares WHERE secretHash = '"+secretHash+"'",
        me      = this;

    me._query(query, function (error, results) {
        if (error) {
            callback(error);
        } else {
            var userId  = results[0].id,
                query2  = "INSERT INTO argos_usuarios_particulares_direcciones (cf_usuarios_particulares, direccion, cp, numero, piso, poblacion, provincia)" +
                    "VALUES ("+userId+", '"+address.direccion+"', '"+address.cp+"', '"+address.numero+"', '"+address.piso+"', '"+address.poblacion+"', '"+address.provincia+"')";

            me._query(query2, function (error, results) {
                if(error) {
                    callback(error);
                } else {
                    var query3 = "SELECT id_direcciones FROM argos_usuarios_particulares_direcciones WHERE id_direcciones = last_insert_id()";

                    me._query(query3, function (error, result) {
                        if(error) {
                            callback(error);
                        } else {
                            callback(null, result[0].id_direcciones);
                        }
                    });
                }
            });
        }
    });
};

var saveCreditCard = function (creditCard, callback) {
    var query   = "SELECT id, email FROM argos_usuarios_particulares WHERE secretHash = '"+creditCard.usrHash+"'",
        me      = this;

    me._query(query, function (error, results) {
        if (error) {
            callback(error);
        } else {
            var userId  = results[0].id,
                query2  = "INSERT INTO argos_usuarios_particulares_targetas (numero, caducidad_mes, caducidad_ano, ccv, cf_usuario_particular, card_name)" +
                    "VALUES ('"+creditCard.numero+"', '"+creditCard.caducidad_mes+"', '"+creditCard.caducidad_ano+"', '"+creditCard.ccv+"', '"+userId+"', '"+creditCard.saveCardName+"')";

            me._query(query2, function (error, results) {
                if(error) {
                    callback(error);
                } else {
                    callback(null, null);
                }
            });
        }
    });
};

var getValorReembolso = function (valorSeguro, callback) {
    var query = "SELECT valor, valor2 FROM argos_abonados_precios_extras WHERE cf_abonados_tipos_extras = 4 AND cf_abonado = 294";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            callback(null, results[0]);
        }
    })
};

var getValorSms = function (callback) {
    var query = "SELECT valor FROM argos_abonados_precios_extras WHERE cf_abonados_tipos_extras = 9 AND cf_abonado = 294";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            callback(null, results[0]);
        }
    });
};

var getValorPackaging = function (callback) {
    var query = "SELECT valor FROM argos_abonados_precios_extras WHERE cf_abonados_tipos_extras = 10 AND cf_abonado = 294";

    this._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            callback(null, results[0]);
        }
    });
};

var getUserCreditCards = function (userHash, callback) {
    var me      = this,
        query   = "SELECT id FROM argos_usuarios_particulares WHERE secretHash = '"+userHash+"'";

    me._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            var userId = results[0].id,
                query2 = "SELECT * FROM argos_usuarios_particulares_targetas WHERE cf_usuario_particular = "+userId;

            me._query(query2, function (error, results) {
                if(error) {
                    callback(error);
                } else {
                    if(results.length == 0) {
                        callback(null, null);
                    } else {
                        callback(null, results);
                    }
                }
            });
        }
    });
};

var updateAddress = function (secretHash, address, callback) {
    var me = this;

    var query = "SELECT id FROM argos_usuarios_particulares WHERE secretHash = '"+secretHash+"'";

    me._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            if(typeof results[0] != 'undefined') {
                var userId = results[0].id;

                var query2 = "UPDATE argos_usuarios_particulares_direcciones " +
                    "SET direccion = '"+address.direccion+"', " +
                    "cp = '"+address.cp+"', " +
                    "numero = '"+address.numero+"', " +
                    "piso = '"+address.piso+"', " +
                    "poblacion = '"+address.poblacion+"', " +
                    "provincia = '"+address.provincia+"' " +
                    "WHERE cf_usuarios_particulares = "+userId +" " +
                    "AND id_direcciones = "+address.id_direcciones;

                me._query(query2, function (error, results) {
                    if(error) {
                        callback(error);
                    } else {
                        if(results.affectedRows == 1) {
                            callback(null, 'OK');
                        } else {
                            callback('NO SE HA REALIZADO EL UPDATE');
                        }
                    }
                });
            } else {
                callback('Usuario no encontrado');
            }
        }
    });
};

var updateCreditCard = function (secretHash, card, callback) {
    var me = this;

    var query = "SELECT id FROM argos_usuarios_particulares WHERE secretHash = '"+secretHash+"'";

    me._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            if(typeof results[0] != 'undefined') {
                var userId = results[0].id;

                var query2 = "UPDATE argos_usuarios_particulares_targetas " +
                    "SET numero = '"+card.numero+"', " +
                    "caducidad_mes = '"+card.caducidad_mes+"', " +
                    "caducidad_ano = '"+card.caducidad_ano+"', " +
                    "ccv = '"+card.ccv+"', " +
                    "card_name = '"+card.card_name+"' " +
                    "WHERE cf_usuario_particular = "+userId+
                    " AND id = "+card.id;

                me._query(query2, function (error, results) {
                    if(error) {
                        callback(error);
                    } else {
                        if(results.affectedRows == 1) {
                            callback(null, 'OK');
                        } else {
                            callback('NO SE HA REALIZADO EL UPDATE');
                        }
                    }
                });
            } else {
                callback('Usuario no encontrado');
            }
        }
    });
};

var deleteCard = function (secretHash, card, callback) {
    var me = this;

    var query = "SELECT id FROM argos_usuarios_particulares WHERE secretHash = '"+secretHash+"'";

    me._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            if(typeof results[0] != 'undefined') {
                var userId = results[0].id;

                var query2 = "DELETE FROM argos_usuarios_particulares_targetas WHERE id = "+card.id+" " +
                "AND cf_usuario_particular = "+userId;

                me._query(query2, function (error, results) {
                    if(error) {
                        callback(error);
                    } else {
                        if(results.affectedRows == 1) {
                            callback(null, 'OK');
                        } else {
                            callback('NO SE HA REALIZADO EL UPDATE');
                        }
                    }
                });
            } else {
                callback('Usuario no encontrado');
            }
        }
    });
};

var getUserPreferences = function (secretHash, callback) {
    var me = this;

    var query = "SELECT id FROM argos_usuarios_particulares WHERE secretHash = '"+secretHash+"'";

    me._query(query, function (error, results) {
        if (error) {
            callback(error);
        } else {
            if (typeof results[0] != 'undefined') {
                var userId = results[0].id;

                var query2 = "SELECT * FROM argos_usuarios_particulares_preferencias WHERE cf_usuario_particular ="+userId;

                me._query(query2, function (error, results) {
                    if(error) {
                        callback(error);
                    } else {
                        callback(null, results);
                    }
                })
            }
        }
    });
};

var insertCard = function (secretHash, card, callback) {
    var me = this;

    var query = "SELECT id FROM argos_usuarios_particulares WHERE secretHash = '"+secretHash+"'";

    me._query(query, function (error, results) {
        if(error) {
            callback(error);
        } else {
            if(typeof results[0] != 'undefined') {
                var userId = results[0].id;

                var query2 = "INSERT INTO argos_usuarios_particulares_targetas (numero, caducidad_mes, caducidad_ano, ccv, cf_usuario_particular, card_name) " +
                    "VALUES ('"+card.numero+"', '"+card.caducidad_mes+"', '"+card.caducidad_ano+"', '"+card.ccv+"', '"+userId+"', '"+card.card_name+"')";

                me._query(query2, function (error, results) {
                    if(error) {
                        callback(error);
                    } else {
                        var query3 = "SELECT id FROM argos_usuarios_particulares_targetas WHERE id = last_insert_id();";

                        me._query(query3, function (error, results) {
                            if(error) {
                                callback(error);
                            } else {
                                var id = results[0].id;
                                var query4 = "SELECT * FROM argos_usuarios_particulares_targetas WHERE id ="+id+" AND cf_usuario_particular = "+userId;

                                me._query(query4, function (error, results) {
                                    if(error) {
                                        callback(error);
                                    } else {
                                        var id = results[0].id;
                                        callback(null, id);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                callback('Usuario no encontrado');
            }
        }
    });
};

var getPackagePrice = function (peso, zone, bultos, idx, callback) {
    var query = "SELECT id2 FROM argos_abonados_tipologia_paquetes WHERE cf_abonado = 294" +
        " AND "+peso+" between min and max";

    var me = this;

    me._query(query, function(error, results) {
        if(error) {
            callback(error);
        } else {
            if(results.length > 0) {
                // buscamos precio paquete
                var idPaquete = results[0].id2;

                var query3 = "SELECT precio FROM argos_abonados_precios_paquetes WHERE cf_zona = "+zone+" AND cf_tipo_paquete = "+idPaquete;

                me._query(query3, function (error, price) {
                    if(error) {
                        callback(error);
                    } else {
                        callback(null, price[0].precio, bultos, idx);
                    }
                });
            } else {
                var query2 = "SELECT id2, max(t.max) as max FROM argos_abonados_tipologia_paquetes as t WHERE cf_abonado = 294";

                me._query(query2, function (error, maxPackage) {
                    if(error) {
                        callback(error);
                    } else {
                        if(maxPackage.length > 0) {
                            var idPaquete = maxPackage[0].id2;
                            var query4 = "SELECT precio FROM argos_abonados_precios_paquetes WHERE cf_zona = "+zone+" AND cf_tipo_paquete = "+idPaquete;

                            me._query(query4, function (error, precio) {
                                if(error) {
                                    callback(error);
                                } else {
                                    callback(null, precio[0].precio, bultos, idx);
                                }
                            });
                        } else {
                            callback(null, null);
                        }
                    }
                });
            }
        }
    });
};

var getUserByRecoveryPasswordHash = function (hash, callback) {
    var me      = this,
        query   = "SELECT * FROM argos_usuarios_particulares WHERE recoveryPasswordHash = '"+hash+"'";

    me._query(query, function (error, data) {
        if(error) {
            callback(error);
        } else {
            callback(null, data);
        }
    });
};



module.exports = function(prototype){
    prototype.login = login;
    prototype.getUserAddresses = getUserAddresses;
    prototype.isCpInAgencyCover = isCpInAgencyCover;
    prototype.getAgencyCpZone = getAgencyCpZone;
    prototype.getPackagePrice   = getPackagePrice;
    prototype.getZonaNacional = getZonaNacional;
    prototype.getValorSeguro = getValorSeguro;
    prototype.getValorReembolso = getValorReembolso;
    prototype.getValorSms = getValorSms;
    prototype.getValorPackaging = getValorPackaging;
    prototype.getUserCreditCards = getUserCreditCards;
    prototype.savePersonalAddress = savePersonalAddress;
    prototype.saveCreditCard = saveCreditCard;
    prototype.getUserOrder = getUserOrder;
    prototype.getUser = getUser;
    prototype.updateUser = updateUser;
    prototype.updateAddress = updateAddress;
    prototype.updateCreditCard = updateCreditCard;
    prototype.deleteCard = deleteCard;
    prototype.insertCard = insertCard;
    prototype.getUserPreferences = getUserPreferences;
    prototype.insertAddress = insertAddress;
    prototype.deleteAddress = deleteAddress;
    prototype.savePreferences = savePreferences;
    prototype.getUserByEmail = getUserByEmail;
    prototype.setUserRecoveryPasswordHash = setUserRecoveryPasswordHash;
    prototype.getUserByRecoveryPasswordHash = getUserByRecoveryPasswordHash;
};
