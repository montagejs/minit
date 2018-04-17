/**
 * @module ui/main.reel
 */
var Component = require("montage/ui/component").Component;
var DataQuery = require("montage/data/model/data-query").DataQuery;
var Criteria = require("montage/core/criteria").Criteria;

var {{exportedName}} = require("data/descriptors/{{name}}.mjson").montageObject;
var mainService = require("data/main.mjson").montageObject;

/*
var serialize = require("montage/core/serialization/serializer/montage-serializer").serialize;
var query = serialize(dataQuery, require);
*/

function assert(msg, assertion, debug) {
    if (assertion) {
        console.info(msg, 'ok');
    } else {
        console.error(msg, 'error', debug);
    }
}

/**
 * @class Main
 * @extends Component
 */
exports.Main = Component.specialize(/** @lends Main# */ {
    constructor: {
        value: function Main() {
            this.super();

            // myMsg from service
            var dataType = {{exportedName}};

            mainService.fetchData(dataType).then(function (res) {
                assert('fetchData:withType', res.length === 1, res);

                // Create reply
                var myMsg = mainService.createDataObject(dataType);
                myMsg.subject = "RE: You've got mail";
                mainService.saveDataObject(myMsg).then(function () {

                    assert('saveDataObject.created', typeof myMsg.created !== 'undefined', myMsg);
                    assert('saveDataObject.updated', typeof myMsg.updated === 'undefined', myMsg);
                    myMsg.text = "Add missing text";

                    // myMsg is updated
                    mainService.saveDataObject(myMsg).then(function () {
                        assert('saveDataObject.text', typeof myMsg.text !== 'undefined', myMsg);
                        assert('saveDataObject.updated', typeof myMsg.updated !== 'undefined', myMsg);

                        // myMsg from service
                        mainService.fetchData(dataType).then(function (res) {
                        
                            assert('fetchData', res.length == 2, res);

                            // myMsg is deleted
                            mainService.deleteDataObject(myMsg).then(function () {
                                
                                // myMsg from service with criteria
                                var dataExpression = "";
                                var dataParameters = {
                                    id: myMsg.id
                                };
                                var dataCriteria = new Criteria().initWithExpression(dataExpression, dataParameters);
                                var dataQuery  = DataQuery.withTypeAndCriteria(dataType, dataCriteria);
                                
                                mainService.fetchData(dataQuery).then(function (res) {
                                    assert('fetchData:withTypeAndCriteria', res.length === 0, res);

                                    // myMsg from service
                                    mainService.fetchData(dataType).then(function (res) {
                                        assert('fetchData:withType', res.length === 1, res);
                                    });
                                });
                            });
                        });
                    }); 
                }); 
            });
        }
    }
});

