/*global describe,beforeEach,it,expect,spyOn,jasmine */

var SandboxedModule = require('sandboxed-module');
var Command = require("commander").Command;
var Q = require("q");

describe("package template", function () {
    var testCommand;
    var Template;
    var NpmWrapperMock;
    beforeEach(function() {
        NpmWrapperMock = function (config) {
            this.config = config;
        };
        NpmWrapperMock.prototype.install = function() {
            return Q();
        };
        NpmWrapperMock.prototype.close = function() {};

        Template = SandboxedModule.require('../../templates/package', {
            requires: {
                '../lib/template-base': {
                    TemplateBase: {
                        addOptions: function(command) {
                            return command;
                        },
                        finish: function () {
                            return Q();
                        }
                    }
                },
                '../lib/npm-wrapper': NpmWrapperMock
            }
        }).Template;

        testCommand = new Command();

    });

    it("should have a commandDescription defined on prototype", function () {
        expect(Template.commandDescription).toBeDefined();
    });

    it("should return the command from addOptions", function () {
        expect(Object.create(Template).addOptions(testCommand)).toBe(testCommand);
    });

    describe("command", function () {

        it("should have --name option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-n")).toBeDefined();
            expect(command.optionFor("--name")).toBeDefined();
        });

        it("should have --copyright option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-c")).toBeDefined();
            expect(command.optionFor("--copyright")).toBeDefined();
        });
    });

    describe("install dependencies", function () {
        var template;
        beforeEach(function () {
            template = Object.create(Template);
        });

        it("uses the npm registry if online", function () {
            Object.defineProperty(template, "_isOnline", {
                value: function () {
                    return Q(true);
                },
            });
            spyOn(NpmWrapperMock.prototype, "install").andCallThrough();

            return template.installDependencies({})
            .then(function () {
                expect(NpmWrapperMock.prototype.install).toHaveBeenCalled();
                var config = NpmWrapperMock.prototype.install.mostRecentCall.object.config;
                expect(config.hasOwnProperty("registry")).toBe(false);
            });
        });

        it("installs from cache if offline", function () {
            Object.defineProperty(template, "_isOnline", {
                value: function () {
                    return Q(false);
                },
            });
            spyOn(NpmWrapperMock.prototype, "install").andCallThrough();

            return template.installDependencies({})
            .then(function () {
                expect(NpmWrapperMock.prototype.install).toHaveBeenCalled();
                var config = NpmWrapperMock.prototype.install.mostRecentCall.object.config;
                expect(config.hasOwnProperty("registry")).toBe(true);
                expect(config.registry).toBe(null);
            });
        });

        it("uses the npmCache option if given", function () {
            spyOn(template, "installDependencies");
            Object.defineProperty(template, "installDependencies", {
                value: jasmine.createSpy().andCallFake(function () { return Q(); })
            });
            template.options = {
                name: "",
                npmCache: "pass"
            };

            return template.finish("")
            .then(function () {
                expect(template.installDependencies).toHaveBeenCalled();
                expect(template.installDependencies.mostRecentCall.args[0].cache).toEqual("pass");
            });
        });

    });

});
