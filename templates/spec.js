var TemplateBase = require("../lib/template-base.js").TemplateBase;
var Q = require("q");

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "jasmine spec"
    },

    addOptions: {
        value:function (command) {
            command.option('-n, --name <name>', 'module name');
            command.option('-t, --title [name]', 'title of the test');
            return command;
        }
    },

    didSetOptions: {
        value:function (options) {
            if (!options.title && options.name) {
                options.title = options.name.replace(/(?:^|-)([^-])/g, function(match, g1) { return g1.toUpperCase() });
            }
        }
    },

    destination: {
        value: "test/"
    },

    finish: {
        value: function() {
            var self = this;
            return TemplateBase.finish.call(this).then(function(result) {
                var message = 'add "test/' + self.options.name + '-spec" to test/all.js ';
                console.log(message);
                return Q.resolve(message);
            });
        }
    }

});
