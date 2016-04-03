var express = require('express');
var app = express();
var Twit = require('twit')
cred = require('./js/config.js');


var T = new Twit({
  consumer_key: cred.twitter.consumer_key,
  consumer_secret:cred.twitter.consumer_secret,
  access_token: cred.twitter.access_token,
  access_token_secret:cred.twitter.access_token_secret
});


//Serve the static files
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/style', express.static(__dirname + '/style'));
app.use('/js', express.static(__dirname + '/js'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

//Do the request and serve the result
app.get('/getTweets', function(req, res) {
	var lon = req.query.lon;
	var lat = req.query.lat;
	var geocode = lat.toString() +"," + lon.toString() + ",10mi";
	T.get('search/tweets', {q: 'snow OR ski', count: 20, geocode:geocode}, function(err, data, response) {
  		res.send(data);
	})	

});

app.listen(8080);
