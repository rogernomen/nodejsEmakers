var Express = require('express');
var app = Express();
var http = require('http');

// Log every request and response to stdout.
var logger = require('morgan');
app.use('/', logger('dev'));

// Compress every response > 1kb if possible.
var compression = require('compression');
app.use('/', compression());

// On a POST or a PUT request, the Content-Type header must be application/json.
var checkContentTypeIsJSON = require('./lib/middleware-check-content-type-is-json');
app.use('/', checkContentTypeIsJSON);

// Parse the request body if it is a JSON and populate request.body with its contents.
var bodyParser = require('body-parser');
app.use('/', bodyParser.json());

// Catch errors from body-parser.
app.use('/', function(error, request, response, next){
    response.status(400).json({error : http.STATUS_CODES[400]});
});

// Pass the database to all middleware functions through the response object.
var Database = require('./lib/database-mysql/index');
var database;
app.use('/', function(request, response, next){
    if (!database){
        database = new Database(request.hostname);
    }
    response.locals.database = database;
    next();
});

// Middleware to perform HTTP basic authentication on every request.
var basicAuth = require('./lib/middleware-basic-auth-mysql');
app.use('/', basicAuth);

// Middleware for the /couriers endpoint.
var couriers = require('./lib/router-couriers');
app.use('/couriers', couriers);

// Middleware for the /cities endpoint.
var cities = require('./lib/router-cities');
app.use('/cities', cities);

// Middleware for the /routes endpoint.
var routes = require('./lib/router-routes');
app.use('/routes', routes);

// Middleware for the /parcels endpoint.
var parcels = require('./lib/router-parcels');
app.use('/parcels', parcels);

// Middleware for the /drivers endpoint.
var drivers = require('./lib/router-drivers');
app.use('/drivers', drivers);

// Middleware for the /drivers endpoint.
var agencies = require('./lib/router-agencies');
app.use('/agencies', agencies);

// Catch-all middleware that returns 404 not found in a JSON body.
var notFound = function(request, response, next){
    response.status(404).json({error : http.STATUS_CODES[404]});
};
app.use('/', notFound);

// Parse the command line options. Using -p PORT or --port=PORT will change the default port.
var parseArgs = require('minimist')(process.argv.slice(2), {boolean : true});
var port = parseArgs.p || parseArgs.port || 3000;

// Start the server.
var Server = require('./lib/server');
var server = new Server(app, port);
server.start();
