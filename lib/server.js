var https = require('https');
var filesystem = require('fs');

var serverOptions = {
    key : filesystem.readFileSync('sslcerts/emks.net.key', 'utf8'),
    cert : filesystem.readFileSync('sslcerts/emks.net.pem', 'utf8'),
    ca : [filesystem.readFileSync('sslcerts/ca/thawte_tj.pem', 'utf8')],
    secureProtocol : 'TLSv1_method',
    honorCipherOrder : true
};

var Server = function(app, port){
    var self = this;
    self.port = port || 3000;
    self.httpsServer = https.createServer(serverOptions, app);
    self.httpsServer.on('error', function(error){
        console.error('HTTPS server error: ' + error);
    });
    self.httpsServer.on('listening', function(){
        console.log('HTTPS server listening on port ' + self.port + ' ...');
    });
};

Server.prototype.start = function(){
    this.httpsServer.listen(this.port);
};

module.exports = Server;
