var express = require('express');
var router  = express.Router();
var http    = require('http');
var fs      = require('fs');
var nodemailer = require("nodemailer");
var smtpTransport = require('nodemailer-smtp-pool');
var async           = require('async');

router.post('/login', function(request, response, next){
    var user    = request.body.user,
        pass    = request.body.password;

    response.locals.database.login(user, pass, function(error, user){
        if(error){
            response.status(500).json({error : error.message});
        }else{
            if (typeof user !== 'undefined') {
                response.status(200).json({result : user});
            } else {
                response.status(200).json({result : "KO"});
            }
        }
    });
});

router.post('/recoveryEmail/', function (request, response, next) {
    var post    = request.body,
        email   = post.email;

    async.series([
            function(callback){
                response.locals.database.getUserByEmail(email, function (error, data) {
                    if(error) {
                        console.log(error);
                    } else {
                        callback(null, data);
                    }
                });
            }],
        // optional callback
        function(err, results){
            response.locals.database.setUserRecoveryPasswordHash(results[0], function (error, hash) {
                if(error) {
                    response.status(500).json({error : error.message});
                } else {
                    var transporter = nodemailer.createTransport(smtpTransport({
                        host: 'smtp.emakers.es',
                        port: 25,
                        ignoreTLS : true,
                        auth: {
                            user: 'no-reply@emakers.es',
                            pass: 'H153g7Z2'
                        }
                    }));

                    fs.readFile('lib/templates/recoveryPasswordEmail.html', 'utf8', function (err,data) {
                        if (err) {
                            return console.log(err);
                        }
                        var result  = data.replace(/{SALUDO}/g, 'Hola'),
                            result  = result.replace(/{NOMBRE_DESTINATARIO}/g, results[0].nombre),
                            result  = result.replace(/{SECRET_HASH}/g, hash);

                        transporter.sendMail({
                            to: results[0].email,
                            subject: 'hello',
                            html: result,
                            from: 'no-reply@emakers.es'
                        }, function(error, response) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Recovery password email sent to: '+results[0].email);
                            }
                        });

                    });
                }
            });
        }
    );
});

router.get('/getUserAddresses/:id', function (request, response, next) {
    var userId = request.params.id;

    response.locals.database.getUserAddresses(userId, function (error, addresses) {
        if(error) {
            response.status(500).json({error : error.message});
        }  else {
            if(typeof addresses[0] !== 'undefined') {
                response.status(200).json({result : addresses});
            } else {
                response.status(200).json({result : "KO"});
            }
        }
    });
});

router.post('/updateAddress', function (request, response, next) {
    var data        = request.body,
        secretHash  = data.secretHash,
        address     = data.address;

    if(address.cf_usuarios_particulares == '') {
        response.locals.database.insertAddress(secretHash, address, function (error, result) {
            if(error) {
                response.status(500).json({error : error.message});
            } else {
                response.status(200).json({result : result});
            }
        });
    } else {
        response.locals.database.updateAddress(secretHash, address, function (error, result) {
            if(error) {
                response.status(500).json({error : error.message});
            } else {
                response.status(200).json({result : "OK"});
            }
        });
    }
});

router.post('/deleteAddress', function (request, response, next) {
    var data        = request.body,
        secretHash  = data.secretHash,
        address     = data.address;

    response.locals.database.deleteAddress(secretHash, address, function (error, result) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : "OK"});
        }
    });
});

router.post('/savePreferencias', function (request, response, next) {
    var data        = request.body,
        secretHash  = data.secretHash,
        preferences     = data.preferences;

    response.locals.database.savePreferences(secretHash, preferences, function (error, result) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : "OK"});
        }
    });
});

router.post('/calculatePrice', function (request, response, next) {

    var NewSend     = request.body,
        cpOrigen    = NewSend.remitenteData.addressess[NewSend.remitenteData.addressSelect].addressCp,
        cpDestino   = NewSend.destinatarioData.addressCp,
        bultos      = NewSend.bultos;

    response.locals.database.isCpInAgencyCover(cpOrigen, function (error, agencyId) {
        var me = this;
        me.finalPrice = 0;
        me.queryError = false;


        if(error) {
            response.status(500).json({error : error.message});
        } else {
            if(agencyId === 0) {
                // NO HAY COBERTURA EMAKERS
                response.locals.database.getZonaNacional(cpOrigen, cpDestino, function (error, zone) {
                   if(error) {
                       response.status(500).json({error : error.message});
                   } else {
                       if(zone.length > 0) {
                           var zone = zone[0].cf_zona;

                           var getBultosPrice = function (bultos) {
                               for(var idxBultos = 0, limitBultos = bultos.length; idxBultos < limitBultos; idxBultos++) {
                                   // COMPARAMOS PESO VULUMETRIO CON PESO REAL
                                   var peso         = 0;
                                   var volumetrico  = ((bultos[idxBultos].Alto * bultos[idxBultos].Largo * bultos[idxBultos].Ancho) * 250) / 1000000;

                                   if(bultos[idxBultos].peso < volumetrico) {
                                       peso = volumetrico;
                                   } else {
                                       peso = bultos[idxBultos].peso;
                                   }

                                   // BUSCAMOS PRECIO POR PESO PAQUETE + ZONA
                                   response.locals.database.getPackagePrice(peso, zone, bultos, idxBultos, function (error, price, bultos, idxBultos) {
                                       if(error) {
                                           response.status(500).json({error : 1});
                                       } else {
                                           bultos[idxBultos].Precio = price * bultos[idxBultos].cantidad;
                                           var limitBultos = bultos.length;
                                           if(idxBultos == limitBultos-1) {
                                               var finalPrice = 0;
                                               for(var i = 0, limit = limitBultos; i < limitBultos; i++) {
                                                   finalPrice = finalPrice + bultos[i].Precio;
                                                   if(i == (limit-1)) {
                                                       response.status(200).json({result : bultos});
                                                   }
                                               }
                                           }
                                       }
                                   });
                               }
                           };

                           getBultosPrice(bultos);
                       } else {
                           response.status(500).json({error : 1});
                       }
                   }
                });
            } else {
                response.locals.database.getAgencyCpZone(cpDestino, agencyId, function (error, zone) {
                   if(error) {
                       response.status(500).json({error : error.message});
                   } else {
                       if(zone != null) {
                           var finalPrice    = [];

                           var getBultosPrice = function (bultos) {
                               for(var idxBultos = 0, limitBultos = bultos.length; idxBultos < limitBultos; idxBultos++) {
                                   // COMPARAMOS PESO VULUMETRIO CON PESO REAL
                                   var peso         = 0;
                                   var volumetrico  = ((bultos[idxBultos].Alto * bultos[idxBultos].Largo * bultos[idxBultos].Ancho) * 250) / 1000000;

                                   if(bultos[idxBultos].peso < volumetrico) {
                                       peso = volumetrico;
                                   } else {
                                       peso = bultos[idxBultos].peso;
                                   }

                                   // BUSCAMOS PRECIO POR PESO PAQUETE + ZONA
                                   response.locals.database.getPackagePrice(peso, zone.id_grupo_zona, bultos, idxBultos, function (error, price, bultos, idxBultos) {
                                       if(error) {
                                           response.status(500).json({error : 2});
                                       } else {
                                           bultos[idxBultos].Precio = price * bultos[idxBultos].cantidad;
                                           var limitBultos = bultos.length;
                                           if(idxBultos == limitBultos-1) {
                                               var finalPrice = 0;
                                               for(var i = 0, limit = limitBultos; i < limitBultos; i++) {
                                                   finalPrice = finalPrice + bultos[i].Precio;
                                                   if(i == (limit-1)) {
                                                       response.status(200).json({result : bultos});
                                                   }
                                               }
                                           }
                                       }
                                   });
                               }
                           };

                            getBultosPrice(bultos);
                       } else {
                           response.status(500).json({error : 2});
                       }
                   }
                });
            }
        }
    });
});

router.get('/getValorSeguro/:valor', function (request, response, next) {
    response.locals.database.getValorSeguro(request.params.valor, function (error, data) {
        if(error) {
            response.status(500).json({error: error.message});
        } else {
            response.status(200).json({result: data});
        }
    });
});

router.get('/getValorReembolso/:valor', function (request, response, next) {
    response.locals.database.getValorReembolso(request.params.valor, function (error, data) {
        if(error) {
            response.status(500).json({error: error.message});
        } else {
            response.status(200).json({result: data});
        }
    });
});

router.get('/getValorSms', function (request, response, next) {
    response.locals.database.getValorSms(function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.get('/getValorPackaging', function (request, response, next) {
    response.locals.database.getValorPackaging(function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.get('/getUserCreditCards/:userHash', function(request, response, next) {
    var userHash = request.params.userHash;

    response.locals.database.getUserCreditCards(userHash, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.post('/savePersonalAddress', function (request, response, next) {
    var address = request.body;

    response.locals.database.savePersonalAddress(address, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.post('/updateCreditCard', function (request, response, next) {
    var post        = request.body,
        secretHash  = post.secretHash,
        card        = post.card;

    response.locals.database.updateCreditCard(secretHash, card, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.post('/deleteCard', function (request, response, next) {
    var post        = request.body,
        secretHash  = post.secretHash,
        card        = post.card;

    response.locals.database.deleteCard(secretHash, card, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.post('/insertCard', function (request, response, next) {
    var post        = request.body,
        secretHash  = post.secretHash,
        card        = post.card;

    response.locals.database.insertCard(secretHash, card, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.get('/getUserPreferences/:secretHash', function (request, response, next) {
    var secretHash =  request.params.secretHash;

    response.locals.database.getUserPreferences(secretHash, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.post('/saveCreditCard', function (request, response, next) {
    var creditCard = request.body;

    response.locals.database.saveCreditCard(creditCard, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.post('/generateNewSend', function (request, response, next) {
    var NewSend = request.body;

    fs.writeFile("tmp/"+NewSend.fileName+".txt", JSON.stringify(NewSend), function(err) {
        if(err) {
            return console.log(err);
        } else {
            var options = {
                host: 'local.argos-web',
                port: 80,
                path: '/scheduled/particulares/import.php',
                method: 'POST'
            };

            var req = http.request(options, function(res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    response.status(200).json({result: chunk});
                });
            });

            req.on('error', function(e) {
                response.status(500).json({error : e.message});
            });

// write data to request body
            req.write('{"fileName" : "'+NewSend.fileName+'"}');
            req.end();

        }


    });
});

router.get('/userOrders/:userId', function (request, response, next) {
    var userId =  request.params.userId;

    response.locals.database.getUserOrder(userId, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.get('/user/:id/:userHash', function (request, response, next) {
    console.log(request.params.id);
    var userHash    = request.params.userHash,
        userId      = request.params.id;

    response.locals.database.getUser(userId, userHash, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});

router.get('/user/:id/recoveryPassword/:recoveryPasswordHash', function (request, response, next) {
    var hash = request.params.recoveryPasswordHash;

    response.locals.database.getUserByRecoveryPasswordHash(hash, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});


router.post('/user/', function (request, response, next) {
    var user = request.body;

    response.locals.database.updateUser(user, function (error, data) {
        if(error) {
            response.status(500).json({error : error.message});
        } else {
            response.status(200).json({result : data});
        }
    });
});


module.exports = router;