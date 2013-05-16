{{#copyright}}/* {{{copyright}}} */

{{/copyright}}/**
    @module {{#destination}}{{destination}}/{{/destination}}{{name}}.reel
    @requires montage
    @requires {{extendsModuleId}}
*/
var Montage = require("montage").Montage,
    {{extendsName}} = require("{{extendsModuleId}}").{{extendsName}};

/**
    @class {{exportedName}}
    @extends {{extendsName}}
*/
exports.{{exportedName}} = Montage.create({{extendsName}}, /** @lends {{exportedName}}# */ {

});
