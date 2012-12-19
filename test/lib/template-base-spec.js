var jasmine = require("jasmine-node");
var SandboxedModule = require('sandboxed-module');

var TemplateBase = require("../../lib/template-base").TemplateBase;

describe("template-base", function () {
    var base;

    it("should be correctly initialized ", function () {
        var directory = "";
        var options = {};
        base = TemplateBase.newWithNameAndOptions(directory, options);

        expect(base.directory).toBe(directory);
        expect(base.options).toBe(options);

     });

});