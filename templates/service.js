var PackageTemplate = require("./package").Template;
var TemplateBase = require("../lib/template-base.js").TemplateBase;
var ArgumentError = require("../lib/error.js").ArgumentError;
var path = require('path');
var fs = require('fs');
var npm = require("npm");
var Q = require('q');
var removeDiacritics = require("diacritics").remove;

var ALPHA_UPPER_REG = /([A-Z])/g,
    ALPHA_LOWER_REG = /-([a-z])/g,
    SEPARATOR1_REG = /--/g,
    SEPARATOR2_REG = /^-/;
    
var _fromCamelToDashes = function(name) {
    var s1 = name.replace(ALPHA_UPPER_REG, function (g) { 
            return "-" + g.toLowerCase(); 
    });
    s1 = s1.replace(SEPARATOR1_REG, "-").replace(SEPARATOR2_REG, "");
    return s1;
};
var _fromDashesToCamel = function(name) {
    var s1 = name.replace(ALPHA_LOWER_REG, function (g) { 
        return g[1].toUpperCase(); 
    });
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
            command.option('-e, --exported-name [name]', 'exported name');
            command.option('-c, --copyright [path]', 'copyright file');
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
            } else {
                throw new ArgumentError("Required name option missing");
            }
            if (!options.exportedName) {
                options.exportedName = this.validateExport(options.name);
            }
            if (options.copyright) {
                options.copyright = this.validateCopyright(options.copyright);
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
                var config = {
                    prefix : path.join(destination, self.options.name),
                    production : true,
                    loglevel: "warn"
                };
                return self.installDependencies(config);
            }).then(function() {
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
            });
        }
    },
});
