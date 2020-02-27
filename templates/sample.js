var TemplateBase = require("../lib/template-base.js").TemplateBase;
var AppTemplate = require("./app").Template;
var ArgumentError = require("../lib/error.js").ArgumentError;
var path = require('path');

var _fromDashesToLowerCamel = function(name) {
    var s1 = name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    s1 = s1[0].toLowerCase() + s1.slice(1);
    return s1;
};

var _fromDashesToUpperCamel = function(name) {
    var s1 = name.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    s1 = s1[0].toUpperCase() + s1.slice(1);
    return s1;
};


exports.Template = Object.create(AppTemplate, {

    commandDescription: {
        value: "sample"
    },

    destination: {
        value: "ui"
    },

    didSetOptions: {
        value: function (options) {
            if (!options.packageName) {
                options.packageName = path.basename(options.packageHome);
            }
            if (!options.relativePackageLocation) {
                options.relativePackageLocation = path.relative(options.destination, options.packageHome);
            }
            if (options.name) {
                options.originalName = options.name;
                options.componentName = _fromDashesToLowerCamel(options.name);
                options.applicationName = _fromDashesToUpperCamel(options.name);
            } else {
                throw new ArgumentError("Required name option missing");
            }
        }
    },

    finish: {
        value: function(destination) {
            var self = this;
            return TemplateBase.finish.call(this).then(function() {
                console.log("# "+ self.options.name +".info created and installed with dependency mappings");
            });
        }
    },

});
