var PackageTemplate = require("./package").Template;
var path = require('path');
var fs = require('fs');
var npm = require("npm");
var Q = require('q');
var removeDiacritics = require("diacritics").remove;

var _firstCapRe = new RegExp('(.)([A-Z][a-z]+)');
var _allCapRe = new RegExp('([a-z0-9])([A-Z])');
var _fromCamelToDashes = function(name) {
    var s1 = name.replace(_firstCapRe, "$1-$2");
    return s1.replace(_allCapRe, "$1-$2").toLowerCase();
};


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
    },

    didSetOptions: {
        value:function (options) {
            if (options.name) {
                options.name = this.validateName(options.name);
            }
            if (options.copyright) {
                options.copyright = this.validateCopyright(options.copyright);
            }
        }
    },

    validateName: {
        value: function(name) {
            name = name.replace(" ", "-");
            // convert to camelcase
            name =  name.replace(/(?:^|-)([^\-])/g, function(_, g1) { return g1.toUpperCase(); });
            // convert back from camelcase to dashes and ensure names are safe to use as npm package names
            return removeDiacritics(_fromCamelToDashes(name));
        }
    },

    validateCopyright: {
        value: function(path) {
            return fs.readFileSync(path, "utf-8");
        }
    },

    defaultPackageHome: {
        value: function (value) {
            return process.cwd();
        }
    }


});
