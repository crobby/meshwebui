const express = require('express');
var bodyParser = require('body-parser')
const app = express();
  
var urlencodedParser = bodyParser.urlencoded({ extended: false })
    
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
    
app.post('/', urlencodedParser, (req, res) => {
    console.log('Got body:', req.body);
    var results = getPrediction(req.body).toString();
    console.log('going to send results:', results);
    res.writeHead(200, { 'Content-Type':'text/html'});
    res.end(results);
    //res.status(200).send(results);
});

var getPrediction = function(postdata) {
  var data = JSON.stringify({"inputs": [{ "name": "predict", "shape": [1, 64], "datatype": "FP32", "data": [0.0, 0.0, 1.0, 11.0, 14.0, 15.0, 3.0, 0.0, 0.0, 1.0, 13.0, 16.0, 12.0, 16.0, 8.0, 0.0, 0.0, 8.0, 16.0, 4.0, 6.0, 16.0, 5.0, 0.0, 0.0, 5.0, 15.0, 11.0, 13.0, 14.0, 0.0, 0.0, 0.0, 0.0, 2.0, 12.0, 16.0, 13.0, 0.0, 0.0, 0.0, 0.0, 0.0, 13.0, 16.0, 16.0, 6.0, 0.0, 0.0, 0.0, 0.0, 16.0, 16.0, 16.0, 7.0, 0.0, 0.0, 0.0, 0.0, 11.0, 13.0, 12.0, 1.0, 0.0]}]});
  var responseData = "";

  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    'Content-Length': data.length
  };

  var options = {
    host: "modelmesh-serving",
    port: 8008,
    path: "/v2/models/"+ "example-mnist-predictor" +"/infer",
    method: "POST",
    headers: headers
  };
  
  let chunks = [];
  var http = require('http');
  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      console.log(d);
      chunks.push(d);
    })

    res.on('end', () => {
      console.log('Response: ');
      console.log(chunks);
      responseData = JSON.parse(Buffer.concat(chunks));
      console.log("after JSOn.parse:", responseData);  
    });
  })
  
  req.on('error', error => {
    console.error(error)
  })

  
  
  req.write(data)
  req.end()
  return(responseData);
};


app.listen(3000);