var PackageTemplate = require("./package").Template;
var TemplateBase = require("../lib/template-base.js").TemplateBase;
var ArgumentError = require("../lib/error.js").ArgumentError;
var path = require('path');
var fs = require('fs');
var npm = require("npm");
var Q = require('q');
var removeDiacritics = require("diacritics").remove;

var _fromCamelToDashes = function(name) {
    var s1 = name.replace(/([A-Z])/g, function (g) { return "-"+g.toLowerCase(); });
    s1 = s1.replace(/--/g, "-").replace(/^-/, "");
    return s1;
};
var _fromDashesToCamel = function(name) {
    var s1 = name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    s1 = s1[0].toUpperCase() + s1.slice(1);
    return s1;
};

exports.Template = Object.create(PackageTemplate, {

    commandDescription: {
        value: "service"
    },

    addOptions: {
        value:function (command) {
            command = PackageTemplate.addOptions.call(this, command);
            command.option('-n, --name <name>', 'service name (required)');
            command.option('-c, --copyright [path]', 'copyright file');
            return command;
        }
    },

    didSetOptions: {
        value:function (options) {
            if (options.name) {
                options.name = this.validateName(options.name);
            } else {
                throw new ArgumentError("Required name option missing");
            }
            if (options.copyright) {
                options.copyright = this.validateCopyright(options.copyright);
            }
        }
    },

    validateName: {
        value: function(name) {
            name = name.replace(/ /g, "-");
            // convert to camelcase
            name =  _fromDashesToCamel(name);
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
    },


    finish: {
        value: function(destination) {
            var self = this;
            return TemplateBase.finish.call(this).then(function() {
                console.log("#");
                console.log("# "+ self.options.name +" service created, run");
                console.log("# > npm run start");
                console.log("# to start service via docker-compose");
                console.log("#");
                console.log("# > npm install .");
                console.log("# to set up the testing dependencies");
                console.log("#");
            });
        }
    },
});