var databaseClass = require('./lib/emakers-api-mysql');
var database = new databaseClass();

var express = require('express');
var app = express();

// Log every request and response to stdout.
var logger = require('morgan');
app.use(logger('dev'));

// Parse every JSON or url-encoded request and populate req.body with its contents.
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// HTTPS Basic authorization
app.use(database.authenticate.bind(database));

// Routes: what to do for a request to a particular endpoint (HTTP method + URI).
app.get('/cities/', database.getCities.bind(database));

app.use(function(request, response, next){
    response.json({
        request: {
            ip: request.ip,
            hostname : request.hostname,
            protocol : request.protocol,
            headers : request.headers,
            url : request.url,
            params : request.params,
            query : request.query,
            body : request.body
        },
        response : {
            user : response.locals.user
        }
    });
});

// Start the server.
var serverClass = require('./lib/emakers-api-server');
var server = new serverClass(app, 3000);
server.start();
