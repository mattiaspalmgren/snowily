// var L = require('leaflet');
dataFactory = require('../data/resorts-weather.js');
var data = dataFactory.getData();
cred = require('./config')
require('mapbox.js')
GeoJSON = require('geojson');


var initMap = function() {
	L.mapbox.accessToken = cred.map.access_token;

	var map = L.mapbox.map('map')
	    .setView([47.1738, 8.4265], 7);
		
	L.mapbox.styleLayer('mapbox://styles/palmn/cimuaw3qm007n8skoe0hgnki3').addTo(map);

	geojson = getGeojson();

	var markerLayer = L.mapbox.featureLayer().addTo(map);
	markerLayer.setGeoJSON(geojson);

	var usLayer = omnivore.topojson('./data/ch-contours.json')
	    .addTo(map);

	return markerLayer;	
}

var getGeojson = function () {
	var geojson = GeoJSON.parse(data, {Point: ['lat', 'lon']});

	for (var i = 0; i < geojson.features.length; i++) {
		geojson.features[i].properties["marker-size"] = 'small';
		geojson.features[i]["marker-color"] = 'blue';
	}

	return geojson;
}

module.exports['initMap'] = initMap;
module.exports['resortData'] = data;
module.exports['getGeojson'] = getGeojson;

