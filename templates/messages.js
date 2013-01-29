var Q = require("q");
var FS = require("q-io/fs");
var jsdom = require("jsdom");
var Path = require("path");

var TemplateBase = require("../lib/template-base").TemplateBase;

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
                        var deferred = Q.defer();
                        // parse with jsdom
                        jsdom.env(contents, deferred.makeNodeResolver());
                        return deferred.promise;
                    })
                    .then(function (window) {
                        // extract text nodes in the body
                        var root = window.document.body;

                        var elements = window.document.querySelectorAll("body, body *");
                        var results = [];
                        var child;
                        for(var i = 0; i < elements.length; i++) {
                            child = elements[i].childNodes[0];
                            if(elements[i].hasChildNodes() && child.nodeType == 3 && child.nodeValue.trim()) {
                                results.push(child.nodeValue.trim());
                            }
                        }

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
