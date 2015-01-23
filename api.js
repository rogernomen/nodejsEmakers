var Express = require('express');
var app = Express();

var Database = require('./lib/database-mysql');
var database = new Database();

// Log every request and response to stdout.
var logger = require('morgan');
app.use('/', logger('dev'));

// Compress every response > 1kb if possible.
var compression = require('compression');
app.use('/', compression());

// Parse the request body if it is a JSON and populate request.body with its contents.
var bodyParser = require('body-parser');
app.use('/', bodyParser.json());

// When the request is a POST method, its Content-Type must be application/json.
var checkPostIsJSON = require('./lib/middleware-check-post-is-json');
app.use('/', checkPostIsJSON);

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
var info = require('./lib/middleware-info');
app.use('/', info);

// Error handling middleware.
var errorHandler = require('./lib/middleware-error-handler');
app.use('/', errorHandler);

// Parse the command line options. Using -p PORT or --port=PORT will change the default port.
var parseArgs = require('minimist')(process.argv.slice(2), {boolean : true});
var port = parseArgs.p || parseArgs.port || 3000;

// Start the server.
var Server = require('./lib/server');
var server = new Server(app, port);
server.start();
