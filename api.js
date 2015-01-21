var express = require('express');
var app = express();

var database-mysql = require('./lib/database-mysql');
var database = new database-mysql();

// Log every request and response to stdout.
var logger = require('morgan');
app.use('/', logger('dev'));

// Parse the request body if it is a JSON and populate request.body with its contents.
var bodyParser = require('body-parser');
app.use('/', bodyParser.json());

// Pass the database to all middleware functions through the response object.
app.use('/', function(request, response, next){
    response.locals.database = database;
    next();
});

// Middleware to perform HTTP basic authentication on every request.
var basicAuth = require('./lib/middleware-basic-auth-mysql');
app.use('/', basicAuth);

// Middleware for the /cities endpoint.
var cities = require('./lib/router-cities');
app.use('/cities', cities);

// Catch-all middleware that returns info about the request and the response.
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

// Error handling middleware.
var errorHandler = require('./lib/middleware-error-handler');
app.use('/', errorHandler);

// Start the server.
var Server = require('./lib/server');
var server = new Server(app, 3000);
server.start();
