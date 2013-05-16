{{#copyright}}/* {{{copyright}}} */

{{/copyright}}/**
    @module {{#destination}}{{destination}}/{{/destination}}{{name}}
    @requires montage{{#extendsModuleId}}
    @requires {{extendsModuleId}}{{/extendsModuleId}}
*/
var Montage = require("montage").Montage{{#extendsModuleId}},
    {{extendsName}} = require("{{extendsModuleId}}").{{extendsName}}{{/extendsModuleId}};
/**
    @class {{exportedName}}
    @extends {{extendsName}}
*/
exports.{{exportedName}} = Montage.create({{extendsName}}, /** @lends {{exportedName}}# */ {

});
