var express = require('express');
var app = express();

//Serve the static files
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/style', express.static(__dirname + '/style'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/data', express.static(__dirname + '/data'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/topo', function(req, res) {
    res.sendFile(__dirname + '/topo.html');
});

app.listen(8080);