/*global xdescribe,describe,beforeEach,it,expect,spyOn,xit */
var SandboxedModule = require('sandboxed-module');

describe("minit", function () {
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
        main = SandboxedModule.require('../cli', mainSandbox);

        expect(addCommandsToSpy).toHaveBeenCalled();
    });

    //disabled feature till it works correctly
    xit("should have serve command", function () {
        main = SandboxedModule.require('../cli', mainSandbox);

        expect(main.command.listeners("serve").length).not.toEqual(0);
    });

    //disabled feature till I figure out how to require modules in a custom directory
    xit("should have --templates-dir option", function () {
        main = SandboxedModule.require('../cli', mainSandbox);

        expect(main.command.optionFor("-t")).toBeDefined();
        expect(main.command.optionFor("--templates-dir")).toBeDefined();
    });

});
