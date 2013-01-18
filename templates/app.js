var PackageTemplate = require("./package").Template;
var path = require('path');
var fs = require('fs');
var npm = require("npm");
var Q = require('q');

exports.Template = Object.create(PackageTemplate, {

    commandDescription: {
        value: "application"
    },

    addOptions: {
        value:function (command) {
            command = PackageTemplate.addOptions.call(this, command);
            command.option('-n, --name <name>', 'application name');
            command.option('-c, --copyright [path]', 'copyright file');
            return command;
        }
    }


});
