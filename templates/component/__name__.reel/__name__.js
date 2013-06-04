{{#copyright}}/* {{{copyright}}} */

{{/copyright}}/**
    @module {{#destination}}{{destination}}/{{/destination}}{{name}}.reel
    @requires {{extendsModuleId}}
*/
var {{extendsName}} = require("{{extendsModuleId}}").{{extendsName}};

/**
    @class {{exportedName}}
    @extends {{extendsName}}
*/
exports.{{exportedName}} = {{extendsName}}.specialize(/** @lends {{exportedName}}# */ {

});
