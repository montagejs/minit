var jasmine = require("jasmine-node");

var SandboxedModule = require('sandboxed-module');

describe("minit", function () {

    describe("argv program", function () {
        var mockCreate;
        var main;
        var mainSandbox;

        beforeEach(function() {
            mockCreate = {};
            mockCreate.addCommandsTo = function (program) { return program; };
            mockCreate.create = function (templateName, config, template) {};

            main = null;

            mainSandbox = {
                requires: {'./lib/create': mockCreate}
            };
       });

        it("should add creation commands", function () {
            var addCommandsToSpy = spyOn(mockCreate, "addCommandsTo");
            main = SandboxedModule.require('../main', mainSandbox);

            expect(addCommandsToSpy).toHaveBeenCalled();
        });

        it("should have serve command", function () {
            main = SandboxedModule.require('../main', mainSandbox);

            expect(main.command.listeners("serve").length).not.toEqual(0);
        });

        it("should have test command", function () {
            main = SandboxedModule.require('../main', mainSandbox);

            expect(main.command.listeners("test").length).not.toEqual(0);
        });

        it("should have --package-home option", function () {
            main = SandboxedModule.require('../main', mainSandbox);

            expect(main.command.optionFor("-p")).toBeDefined();
            expect(main.command.optionFor("--package-home")).toBeDefined();
        });

        it("should have --templates-dir option", function () {
            main = SandboxedModule.require('../main', mainSandbox);

            expect(main.command.optionFor("-t")).toBeDefined();
            expect(main.command.optionFor("--templates-dir")).toBeDefined();
        });
    });

});