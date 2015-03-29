// Parse the command line options. Use -h HOSTNAME to indicate the environment and therefore how to find the DB.
var parseArgs = require('minimist')(process.argv.slice(2), {boolean : true});
if (typeof parseArgs.h === 'undefined'){
	console.log('\nUsage: node generate-constants.js -h HOSTNAME');
	console.log('Example: node generate-constants.js -h bcn.emks.net\n');
	process.exit();
}

var Database = require('./index');
var database = new Database(parseArgs.h);

// Change in what language will the constants be written. 1 = spanish, 2 = english.
var language = 2;

// Change what constants to include in the files and where to find them in the DB.
var fieldNames = ['RouteStatus', 'ParcelStatus', 'DestinationTypes', 'ServiceTypes', 'DemandTypes', 'StreetTypes'];
var tableNames = ['argos_estados_itinerarios', 'argos_estados_entregas', 'argos_tipos_destinos', 'argos_tipos_servicios', 'argos_tipos_demanda', 'argos_tipos_vias'];

var openedFiles = 2;
var fs = require('fs');
var javascriptFile = fs.createWriteStream('./constants.js')
	.on('error', function(error){
		console.log('File error: ' + error);
		process.exit();
	})
	.on('finish', function(){
		openedFiles--;
		if (openedFiles == 0){
			process.exit();			
		}
	});
var javaFile = fs.createWriteStream('./Constants.java')
	.on('error', function(error){
		console.log('File error: ' + error);
		process.exit();
	})
	.on('finish', function(){
		openedFiles--;
		if (openedFiles == 0){
			process.exit();			
		}
	});

javascriptFile.write('var constants = {\n');
javaFile.write('public class Constants{\n\n');
var recursiveWrite = function(){
	if (fieldNames.length == 0){
		javascriptFile.end('};\n\nmodule.exports = constants;\n');
		javaFile.end('}\n');
	} else {
		var fieldName = fieldNames.shift();
		var tableName = tableNames.shift();
		var query = 'SELECT descripcion,id2 FROM ' + tableName + ' WHERE idioma=' + language;
		database._query(query, function(error, results){
			if (error){
				console.log('Error accessing the database: ' + error);
				process.exit();
			} else {
				javascriptFile.write('\t' + fieldName + ': {\n');
				javaFile.write('\tpublic class ' + fieldName + '{\n');
				for (var i = 0; i < results.length; i++){
					var safeName = results[i].descripcion.split(' ').join('_').split('-').join('_');
					javascriptFile.write('\t\t' + safeName + ': ' + results[i].id2);
					javascriptFile.write((i < results.length - 1)? ',\n' : '\n');
					javaFile.write('\t\tpublic static final int ' + safeName + ' = ' + results[i].id2 + ';\n');
				}
				javascriptFile.write((fieldNames.length > 0)? '\t},\n' : '\t}\n');
				javaFile.write('\t}\n\n');
				recursiveWrite();
			}
		})
	}	
};
recursiveWrite();
