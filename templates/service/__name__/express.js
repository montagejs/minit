var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var socket = require('socket.io')(server);
var morgan = require('morgan');
var bodyParser = require('body-parser');

const APP_PUBLIC_PATH = process.env.APP_PUBLIC_PATH || __dirname;
const APP_HOSTNAME = process.env.APP_HOSTNAME || 'localhost';
const APP_PORT = process.env.APP_PORT || '8080';

//don't show the log when it is test
if(process.env.NODE_ENV !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
}

//parse application/json and look for raw text                                        
app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({
    extended: true
}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ 
    type: 'application/json'
}));  

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Serve statics
app.use(express.static(APP_PUBLIC_PATH));

// Load controller
var {{name}} = require('./middleware');

//
// HTTP REST Routing 
// /api/{{name}} GET|POST|PUT|DELETE
//

function resultToHttpResponse(response, event, result) {
    response.header("Content-Type", "application/json");
    response.send(result);
    response.end();
}

app.route("/api/{{name}}")
    .get(function (req, res) {
        {{name}}.fetchData(req, res).then(function (result) {
          resultToHttpResponse(res, 'fetchData', result);
        });
    })
    .post(function (req, res) {
        {{name}}.saveDataObject(req, res).then(function (result) {
          resultToHttpResponse(res, 'saveDataObject', result);
        });
    })
    .put(function (req, res) {
        {{name}}.saveDataObject(req, res).then(function (result) {
          resultToHttpResponse(res, 'saveDataObject', result);
        });
    })
    .delete(function (req, res) {
        {{name}}.deleteDataObject(req, res).then(function (result) {
          resultToHttpResponse(res, 'deleteDataObject', result);
        });
    });


//
// Socket Routing
//

var socketSubscriptions = new Map();
function broadcastsDataOperation(event, data, clientSource) {
  return Array.from(socketSubscriptions).filter(function (socketSubscription) {
    return clientSource && socketSubscription.id !== clientSource.id
  }).map(function (socketSubscription) {
    console.log(socketSubscription, event, data)
    return socket.to(socketSubscription.id).emit(event, data);
  });
}

function resultToSocketResponse(client, event, result) {

    // Preparse
    result = JSON.parse(result);

    client.emit(event, result);
    broadcastsDataOperation(event, result, client);
}

socket.on('connection', function(client) {  

    // Use socket to communicate with this particular client only, sending it it's own id
    client.emit('welcome', { 
      {{name}}: 'Welcome!', 
      time: Date.now(),
      id: client.id 
    });

    // Add socketSubscriptions
    client.on('subscribe', function(data) {
          
        // Get current subscription data or create
        var currentData = socketSubscriptions.get(client.id) || {
          id: client.id
        };

        // Store subscription
        socketSubscriptions.set(client.id, Object.assign(currentData, data));

        // Remove socketSubscriptions on disconnected
        client.on('disconnected', function(client) {
          socketSubscriptions.delete(client.id);
        });

        client.on('unsubscribe', function(data) {
            socketSubscriptions.delete(client.id);
        });
    });

    client.on('fetchData', function (data) {
      {{name}}.fetchData(data).then(function (result) {
        resultToSocketResponse(client, 'fetchData', result);
      });
    });

    client.on('saveDataObject', function (data) {
      {{name}}.saveDataObject(data).then(function (result) {
        resultToSocketResponse(client, 'deleteDataObject', result);
      });
    });

    client.on('deleteDataObject', function () {
      {{name}}.deleteDataObject(data).then(function (result) {
        resultToSocketResponse(client, 'deleteDataObject', result);
      });
    });
});

// Start Service endpoint

server.listen(APP_PORT);
console.log(`Listening on ${APP_HOSTNAME}:${APP_PORT}`);

module.exports = app; // for testing