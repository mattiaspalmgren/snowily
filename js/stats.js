var $ = require('jquery');
dataFactory = require('../data/resorts-weather.js');
var data = dataFactory.getData();
var d3 = require('d3');

var snowHeight = [];
for(var i = 0; i < data.length; i++) {
  var rand = Math.floor((Math.random() * 100) + 1);
  var name = data[i].name;
  snowHeight.push({"name": name, "snow": rand});
}

var initChart = function(hover) {

	var h = $("#stats")[0].clientHeight;
	var w = $("#stats")[0].clientWidth;

	var svg = d3.select("#stats").append("svg")
	    .attr("width", w)
	    .attr("height", h);

	var x = d3.scale.ordinal()
	    .rangeRoundBands([0, w], .1);

	var y = d3.scale.linear()
	    .range([h, h/2]);

		

	x.domain(snowHeight.map(function(d) { return d.name; }));
	y.domain([0, d3.max(snowHeight, function(d) { return d.snow; })]);

	svg.selectAll(".bar")
	      .data(snowHeight)
	    .enter().append("rect")
	      .attr("class", "bar")
	      .attr("x", function(d) { return x(d.name); })
	      .attr("width", x.rangeBand())
	      .attr("y", function(d) { return y(d.snow); })
	      .attr("height", function(d) { return h - y(d.snow); })
	      .on('click', function(d,i){ console.log(d.name) })
	      .on('mouseover', function(d,i) {
	      	hover(d, false)
	      })
	      .on('mouseout', function(d,i) {
	      	hover(d, true)
	      });
	
}

module.exports['initChart'] = initChart;

