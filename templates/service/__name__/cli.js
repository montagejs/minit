#!/usr/bin/env node
// Example:
// node cli.js --fetchData '{ "root": { "prototype": "montage/data/model/data-query", "values": { "criteria": {}, "orderings": [], "prefetchExpressions": null, "typeModule": { "%": "data/descriptors/{{name}}.mjson" } } } }'
var program = require('commander');
 
var package = require('./package.json');
var program = require('commander');
 
program
  .version(package.version)
  .option('-f, --fetchData [query]', 'fetch data')
  .option('-s, --saveDataObject [object]', 'save data object')
  .option('-d, --deleteDataObject [object]', 'delete data object')
  .parse(process.argv);

// Load controller
var main = require('./main');

var command;
if (program.fetchData) {

	command = main.fetchData(program.fetchData).then(function (result) {
		console.log(result);
		process.exit(0);
	});
} else if (program.saveDataObject) {
	command = main.saveDataObject(program.saveDataObject).then(function (result) {
		console.log(result);
		process.exit(0);
	});
} else if (program.deleteDataObject) {
	command = main.deleteDataObject(program.deleteDataObject).then(function (result) {
		console.log(result);
		process.exit(0);
	});
}

command.catch(function (err) {
	console.error(err.stack || err);
	process.exit(1);
});