var Q = require("q");
var FS = require("q-io/fs");
var minidom = require("minidom");
var Path = require("path");

var TemplateBase = require("../lib/template-base").TemplateBase;

function visit(element, visitor) {
    visitor(element);

    var children = element.children;
    var len = children ? children.length : 0;
    for (var i = 0; i < len; i++) {
        console.log("visit child", i, "or", element.tagName);
        visit(children[i], visitor);
    }
}

exports.Template = Object.create(TemplateBase, {

    commandDescription: {
        value: "Scan your templates for messages that should be localized and generate and messages.json"
    },

    addOptions: {
        value:function (command) {
            command = TemplateBase.addOptions.call(this, command);
            command.option('-l, --locale <locale>', 'The current language of your application (default: en)');
            return command;
        }
    },

    process: {
        value: function (options) {
            var self = this;

            // find all html files
            console.log("Finding .html files...");
            return FS.listTree(".", function (path, stat) {
                if (Path.basename(path) === "node_modules") return null;
                return stat.isFile() && Path.extname(path) === ".html";
            })
            .then(function (tree) {
                console.log("Processing " + tree.length + " files...");
                return Q.all(tree.map(function (path) {
                    return FS.read(path).then(function (contents) {
                        return minidom(contents);
                    })
                    .then(function (document) {
                        var body;
                        visit(document, function (element) {
                            if (element.tagName === "BODY") {
                                body = element;
                            }
                        });

                        // Collect all the text nodes
                        var results = [];
                        visit(body, function (element) {
                            // TODO collect more than just the first text node
                            var child = element.childNodes[0];
                            if(element.hasChildNodes() && child.nodeType == 3 && child.nodeValue.trim()) {
                                results.push(child.nodeValue.trim());
                            }
                        });

                        if (results.length) {
                            return { path: path, messages: results };
                        }
                    }).fail(function (err) {
                        console.error("Could not proccess " + path + ": " + err);
                    });
                }));
            })
            .then(function (textNodes) {
                // convert text to key, add to messages
                var messages = {};
                textNodes.forEach(function (data) {
                    if (!data) return;
                    console.log(data.messages.length + " messages found in " + data.path);
                    data.messages.forEach(function (message) {
                        var key = self._convertMessageToKey(message);

                        if (key in messages) {
                            if (messages[key].message === message) {
                                // Add path to locations array
                                messages[key].locations.push(data.path);
                                return;
                            }
                            // Same key different message
                            var newKey = key + Math.round(Math.random() * 1000);
                            console.error("Duplicate key '" + key + "' for message '" + messages[key].message + "' in " + data.path + " and '" + message + "'. Renaming to '" + newKey + "'");
                            key = newKey;
                        }
                        // Create new entry
                        messages[key] = {
                            message: message,
                            description: "",
                            locations: [data.path]
                        };
                    });
                });

                options.messages = JSON.stringify(messages, null, 4);
            })
            .then(function () {
                return TemplateBase.process.call(self, options);
            });
        }
    },

    _convertMessageToKey: {
        value: function (message) {
            return message.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/ /g, "_");
        }
    },

    didSetOptions: {
        value:function (options) {
            options.locale = options.locale || "en";
        }
    }

});
