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
//

app.route("/api/{{name}}")
    .get({{name}}.fetchData)
    .post({{name}}.saveDataObject)
    .put({{name}}.saveDataObject)
    .delete({{name}}.deleteDataObject);

//
// Socket Routing
//

var socketSubscriptions = new Map();
function broadcastsDataOperation(event, data) {
  return Array.from(socketSubscriptions).map(function (socketSubscription) {
    // TODO check socketSubscription.filter
    return socket.to(socketSubscription.id).emit(event, data);
  });
}

socket.on('connection', function(client) {  

    // Use socket to communicate with this particular client only, sending it it's own id
    client.emit('welcome', { 
      message: 'Welcome!', 
      time: Date.now(),
      id: client.id 
    });

    // Add socket to broadcasts
    client.on('join', function(config) {
        socketSubscriptions.set(client.id, Object.assin({
          id: client.id
        }, data));
    });

    client.on('leave', function(data) {
        socketSubscriptions.delete(client.id);
    });

    client.on('fetchData', function (data) {
      {{name}}.fetchData(data).then(function (res) {
        client.emit('fetchData', res);
        broadcastsDataOperation('fetchData', res);
      });
    });

    client.on('saveDataObject', function (data) {
      {{name}}.saveDataObject(data).then(function (res) {
        client.emit('saveDataObject', res);
        broadcastsDataOperation('saveDataObject', res);
      });
    });

    client.on('deleteDataObject', function () {
      {{name}}.deleteDataObject(data).then(function (res) {
        client.emit('deleteDataObject', res);
        broadcastsDataOperation('deleteDataObject', res);
      });
    });
});

// Start Service endpoint

server.listen(APP_PORT);
console.log(`Listening on ${APP_HOSTNAME}:${APP_PORT}`);

module.exports = app; // for testing