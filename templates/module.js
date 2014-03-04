var TemplateBase = require("../lib/template-base.js").TemplateBase;
var ArgumentError = require("../lib/error.js").ArgumentError;
var fs = require('fs');
var removeDiacritics = require("diacritics").remove;

var Command = require("commander").Command;

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

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "module"
    },

    addOptions: {
        value:function (command) {
            command = TemplateBase.addOptions.call(this, command);
            command.usage("-n <name> [options]");
            command.option('-n, --name <name>', 'module name (required)');
            command.option('-e, --exported-name [name]', 'exported name');
            command.option('-c, --copyright [path]', 'copyright file');
            command.option('--extends-module-id [name]', 'module name');
            command.option('--extends-name [name]', 'exported name');
            return command;
        }
    },

    didSetOptions: {
        value:function (options) {

            if (!options.extensionName) {
                options.extensionName = "js";
            }

            if (options.name) {
                options.name = this.validateName(options.name, options);
                var propertyName = _fromDashesToCamel(options.name);
                options.propertyName = propertyName[0].toLowerCase() + propertyName.slice(1);
            } else {
                throw new ArgumentError("Required name option missing");
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
            if (!options.extendsModuleId) {
                options.extendsModuleId = "montage/core/core";
            }

        }
    },

    validateName: {
        value: function(name, options) {
           var exportedName = this.validateExport(name);
            // convert back from camelcase to dashes and ensure names are ascii
            name = removeDiacritics(_fromCamelToDashes(exportedName));

            // cleanup the extension
            var extensionName = options.extensionName,
                extensionPattern, result;

            if (extensionName) {
                extensionPattern = new RegExp("(\\w*)(\." + extensionName + ")$");

                // strip the extension if there is one
                result = extensionPattern.exec(name);
                if (result !== null) {
                    name = result[1];
                }
            }
            return name;
        }
    },

    validateExport: {
        value: function(name) {
            // We accept the name in any format, dashed, spaced or camelcased
            // We then convert to to camelcase and back to get the consistent
            // naming used in Montage
            // remove spaces
            name = name.replace(/ /g, "-");
            // convert to camelcase
            return _fromDashesToCamel(name);
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
