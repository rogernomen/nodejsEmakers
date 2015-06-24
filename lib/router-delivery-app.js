var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');

var appDirectory = process.cwd() + '/delivery_app_files/';

router.get('/version', function(request, response, next){
	fs.readFile(appDirectory + 'version.json', {encoding : 'utf8'}, function(error, data){
		if (error){
			response.status(500).json({error: error.message});
		} else {
			response.json(JSON.parse(data));
		}
	});
});

router.get('/download', function(request, response, next){
	fs.readFile(appDirectory + 'version.json', {encoding : 'utf8'}, function(error, data){
		if (error){
			response.status(500).json({error: error.message});
		} else {
			var object = JSON.parse(data);
			response.download(appDirectory + object.file, function (error){
				if (!response.headersSent && error){
					response.status(500).json({error: error.message});
				}
			});
		}
	});	
});

module.exports = router;
