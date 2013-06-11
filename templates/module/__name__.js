{{#copyright}}/* {{{copyright}}} */

{{/copyright}}/**
 * @module {{#destination}}{{destination}}/{{/destination}}{{name}}
 * @requires {{extendsModuleId}}{{/extendsModuleId}}
 */
var {{extendsName}} = require("{{extendsModuleId}}").{{extendsName}}{{/extendsModuleId}};
/**
 * @class {{exportedName}}
 * @extends {{extendsName}}
 */
exports.{{exportedName}} = {{extendsName}}.specialize(/** @lends {{exportedName}}# */ {
    constructor: {
        value: function {{exportedName}}() {
            this.super();
        }
    }
});
