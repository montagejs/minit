var TemplateBase = require("../lib/template-base.js").TemplateBase;
var Q = require("q");
var Path = require("path");

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "jasmine spec"
    },

    addOptions: {
        value:function (command) {
            command = TemplateBase.addOptions.call(this, command);
            command.option('-n, --name <name>', 'module name');
            command.option('-t, --title [name]', 'title of the test');
            return command;
        }
    },

    destinationOptionDescription: {
        value: "where the template will be expanded relative to the package-home's test directory"
    },

    didSetOptions: {
        value:function (options) {
            if (!options.title && options.name) {
                options.title = options.name.replace(/(?:^|-)([^-])/g, function(match, g1) { return g1.toUpperCase() });
            }
        }
    },

    destination: {
        value: ""
    },

    finalDestination: {
        get: function() {
            return Path.join(this.options.packageHome, "test", this.options.destination)
        }
    },

    finish: {
        value: function() {
            var self = this;
            return TemplateBase.finish.call(this).then(function(result) {
                var message = ['add "test',self.options.destination,self.options.name + '-spec" to test/all.js '].join(Path.sep);
                console.log(message);
                return Q.resolve(message);
            });
        }
    }

});
