const express = require('express');
var bodyParser = require('body-parser')
const app = express();
  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
    
app.post('/', urlencodedParser, (req, res) => {
    console.log('Got body:', req.body);
    getPrediction(req.body);
    res.sendStatus(200);
});

var getPrediction = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
  };

  var options = {
    host: "modelmesh-serving",
    port: 8008,
    path: "v2/models/"+ data.model +"/infer",
    method: "POST",
    headers: headers
  };

  var http = require('http');
  var req = http.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};




app.listen(3000);