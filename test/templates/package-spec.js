var jasmine = require("jasmine-node");

var SandboxedModule = require('sandboxed-module');
var Command = require("commander").Command;

describe("package template", function () {
    var testCommand;
    var Template;
    beforeEach(function() {

        Template = SandboxedModule.require('../../templates/package', {
            requires: {
                '../lib/template-base': {
                    TemplateBase: {}
                }
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

        it("should have --author option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-a")).toBeDefined();
            expect(command.optionFor("--author")).toBeDefined();
        });

        it("should have --montage-path option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-m")).toBeDefined();
            expect(command.optionFor("--montage-path")).toBeDefined();
        });

    });

});