var jasmine = require("jasmine-node");

var SandboxedModule = require('sandboxed-module');
var Command = require("commander").Command;

describe("component template", function () {
    var testCommand;
    var Template;
    beforeEach(function() {

        Template = SandboxedModule.require('../../templates/component', {
            requires: {
                '../lib/template-base': {
                    TemplateBase: {
                        addOptions: function(command) {
                            return command;
                        }
                    }
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

        it("should have --exported-name option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-e")).toBeDefined();
            expect(command.optionFor("--exported-name")).toBeDefined();
        });

        it("should have --extends-name option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("--extends-name")).toBeDefined();
        });

        it("should have --extends-module-id option", function () {
             var command = Object.create(Template).addOptions(testCommand);

             expect(command.optionFor("--extends-module-id")).toBeDefined();
         });

        it("should have --copyright option", function () {
            var command = Object.create(Template).addOptions(testCommand);

            expect(command.optionFor("-c")).toBeDefined();
            expect(command.optionFor("--copyright")).toBeDefined();
        });

    });

    describe("option validation", function () {
        var template;
        var options;
        beforeEach(function () {
            template = Object.create(Template);
            options = {};
        });
        it("should accept name with dashes", function () {
            options.name = "my-component";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-component");
        });
        it("should accept name with spaces", function () {
            options.name = "my component";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-component");
            expect(options.exportedName).toEqual("MyComponent");
        });
        it("should accept camelCased name", function () {
            options.name = "MyComponent";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-component");
            expect(options.exportedName).toEqual("MyComponent");
        });
        it("should convert spaces to dashes in names", function () {
            options.name = "My Component";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-component");
            expect(options.exportedName).toEqual("MyComponent");
        });
        it("should convert multiple spaces to dashes in names", function () {
            options.name = "My Component Has Spaces";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-component-has-spaces");
        });
        // by converting accented characters to ascii equivalents in names
        it("should respect NPM package name conventions (râțéăü -> rateau)", function () {
            options.name = "râțéăü";
            template.didSetOptions(options);
            expect(options.name).toEqual("rateau");
            expect(options.exportedName).toEqual("Rateau");
        });
        it("should transform name to exported name", function () {
            options.name = "my-component";
            template.didSetOptions(options);
            expect(options.name).toEqual("my-component");
            expect(options.exportedName).toEqual("MyComponent");
        });
    });

});
