var L = require('leaflet');
dataFactory = require('../data/resorts-weather.js');
var data = dataFactory.getData();
cred = require('./config')

var map = L.map('map', {zoomControl:false}).setView([47.1738, 8.4265],7);

var initMap = function(toggleFocus) {
	L.tileLayer('https://api.mapbox.com/v4/palmn.f2d7c06b/{z}/{x}/{y}.png?access_token=' + cred.map.access_token,{
		maxZoom: 8,
		minZoom: 7
	}).addTo(map);

	//Preparing data
	for(var i = 0; i < data.length; i++)
	{
	    var circle = L.circle([data[i].lat, data[i].lon], 3000, {
	        color: 'black',
	        fillColor: 'gray',
	        fillOpacity: 0.5,
	        title: data[i].name,  
	    }).addTo(map);

	    // circle.bindPopup(data[i].name);
	    circle.on('click', function(e) {
	    	toggleFocus(e);
	    });  

	    circle.on('mouseover', function (e) {
	        e.target.setRadius(8000);
	    });

	    circle.on('mouseout', function (e) {
	        e.target.setRadius(3000);
	    });
	}
}


module.exports['initMap'] = initMap;
module.exports['resortData'] = data;

