var express = require('express');
var app = express();
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
express.static(APP_PUBLIC_PATH)

// Load controller
var {{name}} = require('./middleware');

// Load controller
app.route("/api/{{name}}")
    .get({{name}}.fetchData)
    .post({{name}}.saveDataObject)
    .put({{name}}.saveDataObject)
    .delete({{name}}.deleteDataObject);

app.listen(APP_PORT);
console.log(`Listening on ${APP_HOSTNAME}:${APP_PORT}`);

module.exports = app; // for testing