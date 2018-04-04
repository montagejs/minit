const PATH = require("path");
const APP_PATH = process.env.APP_PATH || PATH.join(__dirname, ".");

var Montage = require('montage');

// TODO
// In progress - Load Service/Model/Mapping programaticly 
// Next - Load Via main.mjson

var montageRequire;
function getMontageRequire() {
    // Once only
    if (montageRequire) {
        return Promise.resolve(montageRequire);
    }

    return Montage.loadPackage(APP_PATH, {
        mainPackageLocation: APP_PATH
    }).then(function (require) {
        return (montageRequire = require);
    });
}

var mainService;
function getMainService() {
    return getMontageRequire().then(function (mr) {

        // Once only
        if (mainService) {
            return Promise.resolve(mainService);
        }

        // TODO
        // Cannot read property 'defineDeserializationUnit' of undefined
        // at Module.eval (file:///me/node_modules/montage/core/serialization/bindings.js:118:13)
        /*
        return mr.async('montage/core/serialization/deserializer/montage-deserializer').then(function (module) {
            var Deserializer = module.MontageDeserializer;
            return mr.async('data/main.mjson').then(function (descriptor) {
                var deserializer = new Deserializer().init(descriptor, mr);
                return deserializer.deserializeObject();
            }); 
        });
        */

        // Load main service
        return mr.async("montage/data/service/data-service").then(function (module) {
            return (mainService = new module.DataService());

        // Load sub service
        }).then(function (config) {
            return mr.async("logic/model/{{name}}-model").then(function (module) {
                return mr.async("logic/service/{{name}}-service").then(function (module) {
                    var moduleName = "{{exportedName}}Service";
                    mainService.addChildService(new module[moduleName]());
                    return mainService;
                });
            });
        });
    });
}

function serialize(object) {
    return getMontageRequire().then(function (mr) {
        return mr.async('montage/core/serialization/serializer/montage-serializer').then(function (module) {
            return module.serialize(object, mr); 
        });
    });
}

function deserialize(data) {
    return getMontageRequire().then(function (mr) {
        return mr.async('montage/core/serialization/deserializer/montage-deserializer').then(function (module) {
            return module.deserialize(data, mr); 
        });
    });
}

function createDataQueryFromParams(queryParam) {
    return getMontageRequire().then(function (mr) {
        return mr.async("montage/data/service/data-selector").then(function (module) {
            var DataSelector = module.DataSelector;
            return mr.async("montage/core/criteria").then(function (module) {
                var Criteria = module.Criteria;
                return mr.async("logic/model/{{name}}-model").then(function (module) {
                    
                    // A Default Query
                    var dataType = module["{{exportedName}}"];
                    var dataExpression = "";
                    var dataParameters = queryParam;

                    var dataCriteria = new Criteria().initWithExpression(dataExpression, dataParameters);
                    var dataQuery  = DataSelector.withTypeAndCriteria(dataType, dataCriteria);
             
                    return dataQuery;
                
                // Convert to serialized version
                });
            });
        }); 
    });
}

function getDataOperationFromData(data) {
    return getMontageRequire().then(function (mr) {
        return mr.async("montage/data/service/data-selector").then(function (module) {
            var DataSelector = module.DataSelector;
            return mr.async("montage/core/criteria").then(function (module) {
                var Criteria = module.Criteria;
                return deserialize(data);
            });
        }); 
    });
}

function getDataOperationFromRequest(request) {
    var queryParam = request && (request.query.query || request.params.query);
    return queryParam ? 
        getDataOperationFromData(queryParam) : 
            createDataQueryFromParams(request);
}

function getDataOperationResponse(response, queryResult) {
    console.log('getDataOperationResponse', queryResult);
    return serialize(queryResult).then(function (queryJson) {
        console.log('getDataOperationResponse (serialized)', queryJson);
        return queryJson;
    }).then(function (res) {
        if (response) {
            response.header("Content-Type", "application/json");
            response.send(res);
            response.end();
        } else {
            return res;
        }
    });
}

exports.fetchData = function (req, res) {
    return getDataOperationFromRequest(req).then(function (dataQuery) {
        return getMainService().then(function (mainService) {
            return mainService.fetchData(dataQuery).then(function (queryResult) {
                return getDataOperationResponse(res, queryResult);
            });
        });
    });
};

exports.deleteDataObject = function (req, res) {
    return getDataOperationFromRequest(req).then(function (dataObject) {
        return getMainService().then(function (mainService) {
            return mainService.deleteDataObject(dataObject).then(function (result) {
                return getDataOperationResponse(res, result);
            });
        });
    });
};

exports.saveDataObject = function (req, res) {
    return getDataOperationFromRequest(req).then(function (dataObject) {
        return getMainService().then(function (mainService) {
            return mainService.saveDataObject(dataObject).then(function (result) {
                return getDataOperationResponse(res, result);
            });
        });
    });
};