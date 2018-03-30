/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;
var DataSelector = require("montage/data/service/data-selector").DataSelector;
var serialize = require("montage/core/serialization/serializer/montage-serializer").serialize;
var Criteria = require("montage/core/criteria").Criteria;

var {{exportedName}} = require("logic/model/{{name}}-model").{{exportedName}};

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    constructor: {
        value: function Main() {
            this.super();
            var dataExpression = "";
            var dataParameters = {
                name: " Now (" + Date().toString() + ")"
            };
            var dataType = {{exportedName}};
            var dataCriteria = new Criteria().initWithExpression(dataExpression, dataParameters);
            var dataQuery  = DataSelector.withTypeAndCriteria(dataType, dataCriteria);
            var query = serialize(dataQuery, require);
            console.log("dataQuery", query);
            console.log("URL:", "http://localhost:8080/api/fetchData?query=" + encodeURIComponent(query));
        }
    }
});
