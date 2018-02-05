/*global describe,beforeEach,it,expect */

var SandboxedModule = require('sandboxed-module');
var Command = require("commander").Command;
var Q = require("q");
var mockFS = require("mocks").fs;

describe("create", function () {
    var mocks = {};

    beforeEach(function() {
        mocks.blankFS = mockFS.create({
            'minit_home': {
                'templates': {
                }
            },
            'package_home': {
                'package.json': 1
            }
        });
        mocks.simpleFS = mockFS.create({
            'minit_home': {
                'templates': {
                    'testTemplate': {
                    },
                    'testTemplate.js': 1
                }
            },
            'package_home': {
                'package.json': 1
            }
        });
        mocks.template = {destination: 'destination'};
        mocks.template.Template = mocks.template;
        mocks.template.newWithNameAndOptions = function() {
            return mocks.template;
        };
        mocks.template.addOptions = function() {
            return mocks.template;
        };
    });

    describe("load template's command", function () {
        var testCommand;
        beforeEach(function() {
            testCommand = new Command();
            testCommand.minitHome = '/minit_home';
            testCommand.packageHome = '/package_home';
            testCommand.templatesDir = '/minit_home/templates';

        });
        it("should be returned from addCommandsTo", function () {
            var create = SandboxedModule.require('../../lib/create', {
                requires: {
                    'fs': mocks.blankFS
                }
            });
            expect(create.addCommandsTo(testCommand)).toBeDefined();
        });

        it("should add the create:[templateName] command", function () {
            var create = SandboxedModule.require('../../lib/create', {
                requires: {
                    'fs': mocks.simpleFS,
                    '../templates/testTemplate': mocks.template
                }
            });
            create.addCommandsTo(testCommand);
            expect(testCommand.listeners("create:testTemplate").length).not.toEqual(0);

               // .parse([null,null, "create:app"]);
        });

    });
    describe("return a promise", function () {
        var testCommand;
        beforeEach(function() {
            testCommand = new Command();
            testCommand.minitHome = '/minit_home';
            testCommand.packageHome = '/package_home';
            testCommand.templatesDir = '/minit_home/templates';

        });

        it("should resolve the component's config details", function() {
            var create = SandboxedModule.require('../../lib/create', {
                requires: {
                    'fs': mocks.simpleFS,
                    '../templates/testTemplate': mocks.template
                }
            });
            var name = "my-component";
            return create("testTemplate", {
                name: name
            }, {
                'Template': {
                    'newWithDirectory': function(config) {
                        return {
                            'process': function(config) {
                                return Q();
                            }
                        };
                    }
                }
            })
            .then(function(results) {
                expect(results.name).toEqual(name);
            });
        });

        it("should resolve the path of the result created", function() {
            var create = SandboxedModule.require('../../lib/create', {
                requires: {
                    'fs': mocks.simpleFS,
                    '../templates/testTemplate': mocks.template
                }
            });
            var name = "my-component";
            return create("testTemplate", {
                name: name,
                destination: "destination/path"
            }, {
                'Template': {
                    'newWithDirectory': function(config) {
                        return {
                            'process': function(config) {
                                config.extensionName = "ext";
                                return Q();
                            }
                        };
                    }
                }
            })
            .then(function(results) {
                expect(results.resultPath).toEqual("destination/path/my-component.ext");
            });
        });

        it("should add the extension to the resulting file", function() {
            var create = SandboxedModule.require('../../lib/create', {
                requires: {
                    'fs': mocks.simpleFS,
                    '../templates/testTemplate': mocks.template
                }
            });
            var name = "my-component.bar";
            return create("testTemplate", {
                name: name,
                destination: "destination/path"
            }, {
                'Template': {
                    'newWithDirectory': function(config) {
                        return {
                            'process': function(config) {
                                config.extensionName = "ext";
                                return Q();
                            }
                        };
                    }
                }
            })
            .then(function(results) {
                expect(results.resultPath).toEqual("destination/path/my-component.bar.ext");
            });
        });
    });
});
