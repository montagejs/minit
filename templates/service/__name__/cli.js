#!/usr/bin/env node
 
var program = require('commander');
 
program
  .version('0.1.0')
  .option('-f, --fetchData [query]', 'fetch data')
  .option('-f, --saveDataObject [query]', 'fetch data')
  .option('-f, --fetchData [query]', 'fetch data')
  .parse(process.argv);

// Load controller
var main = require('./middleware');

var command;
if (program.fetchData) {
	command = main.fetchData({
		query: program.fetchData
	}).then(function (result) {
		console.log(result);
	});
} else if (program.saveDataObject) {
	command = main.saveDataObject({
		query: program.saveDataObject
	}).then(function (result) {
		console.log(result);
	});
} else if (program.deleteDataObject) {
	command = main.deleteDataObject({
		query: program.deleteDataObject
	}).then(function (result) {
		console.log(result);
	});
}