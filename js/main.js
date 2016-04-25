// -- Inte react - browserify js/main.js > js/bundle.js
//watchify js/main.js -o js/bundle.js -v
//supervisor server.js
//browserify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js
//watchify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactBootstrap = require('react-bootstrap')
map = require('./map')
stats = require('./stats')


var markerLayer = map.initMap();
var geojson = map.getGeojson();

function hover(d, bool) {
  var geojson = map.getGeojson();
  if(!bool) {
    for (var i = 0; i < geojson.features.length; i++) {
      if(geojson.features[i].properties.name === d.name) {
        geojson.features[i].properties["marker-color"] = '#3E606F';
        geojson.features[i].properties["marker-size"] = 'large';
      }
    }
  } 
  markerLayer.setGeoJSON(geojson);
};

stats.initChart(hover);

function findResort(resortName) {
	for(var i = 0; i < map.resortData.length; i++) {
		if(resortName == map.resortData[i].name)
			return map.resortData[i];
	}
}

