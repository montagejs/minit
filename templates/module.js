var TemplateBase = require("../lib/template-base.js").TemplateBase;
var ArgumentError = require("../lib/error.js").ArgumentError;
var fs = require('fs');

var Command = require("commander").Command;

var _firstCapRe = new RegExp('(.)([A-Z][a-z]+)');
var _allCapRe = new RegExp('([a-z0-9])([A-Z])');
var _fromCamelToDashes = function (name){
        var s1 = name.replace(_firstCapRe, "$1-$2");
        return s1.replace(_allCapRe, "$1-$2").toLowerCase();
    };

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "component"
    },

    addOptions: {
        value:function (command) {
            command = TemplateBase.addOptions.call(this, command);
            command.usage("-n <name> [options]");
            command.option('-n, --name <name>', 'module name');
            command.option('-e, --exported-name [name]', 'exported name');
            command.option('-c, --copyright [path]', 'copyright file');
            command.option('--extends-module-id [name]', 'module name');
            command.option('--extends-name [name]', 'exported name');
            return command;
        }
    },

    didSetOptions: {
        value:function (options) {
            if (options.name) {
                options.name = this.validateName(options.name);
                options.propertyName = options.name.replace(/(?:-)([^-])/g, function(match, g1) { return g1.toUpperCase() });
            } else {
                throw new ArgumentError("Missing required name option");
            }

            if (!options.exportedName) {
                options.exportedName = this.validateExport(options.name);
            }
            if (options.jsdoc) {
                options.jsdoc = this.validateJsdoc(options.jsdoc);
            }
            if (options.copyright) {
                options.copyright = this.validateCopyright(options.copyright);
            }
            if (!options.extendsName) {
                options.extendsName = "Montage";
            }

        }
    },

    validateName: {
        value: function(name) {
           var exportedName = this.validateExport(name);
            // convert back from camelcase to dashes
            return _fromCamelToDashes(exportedName);
        }
    },

    validateExport: {
        value: function(name) {
            // We accept the name in any format, dashed, spaced or camelcased
            // We then convert to to camelcase and back to get the consistent
            // naming used in Montage
            // remove spaces
            name = name.replace(" ", "-");
            // convert to camelcase
            return name.replace(/(?:^|-)([^\-])/g, function(_, g1) { return g1.toUpperCase(); });
        }
    },

    validateJsdoc: {
        value: function(jsdocModule) {
            if (jsdocModule.length && jsdocModule.substring(jsdocModule.length - 1) !== "/") {
                return jsdocModule += "/";
            }
            return jsdocModule;
        }
    },

    validateCopyright: {
        value: function(path) {
            return fs.readFileSync(path, "utf-8");
        }
    },

    destination: {
        value: ""
    },

    finish: {
        value: function() {
            var self = this;
            return TemplateBase.finish.apply(this, arguments).then(function(result) {
                console.log(self.options.name + " created.");
                return result;
            });
        }
    }

});
