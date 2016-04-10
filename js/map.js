// var L = require('leaflet');
dataFactory = require('../data/resorts-weather.js');
var data = dataFactory.getData();
cred = require('./config')
require('mapbox.js')




var initMap = function(toggleFocus) {
	// L.tileLayer('https://api.mapbox.com/v4/palmn.f2d7c06b/{z}/{x}/{y}.png?access_token=' + cred.map.access_token,{
	// 	maxZoom: 8,
	// 	minZoom: 7
	// }).addTo(map);
	L.mapbox.accessToken = cred.map.access_token;
	var map = L.map('map', {
		zoomControl:false,
		maxZoom: 8,
		minZoom: 7
	}).setView([47.1738, 8.4265],7);
	map.setMinZoom = 7;
	map.setMaxZoom = 8;
	L.mapbox.styleLayer('mapbox://styles/palmn/cimuaw3qm007n8skoe0hgnki3').addTo(map);

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

