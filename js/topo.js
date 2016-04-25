dataFactory = require('../data/resorts-weather.js');
var data = dataFactory.getData();
var d3 = require('d3');
var geojson = require('geojson');
var q = require('d3-queue');
var topojson = require('topojson');

var width = 960,
    height = 800,
    thresholds = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000],
    contour;

var interpolateColor = d3.interpolateHcl("#FCFFF5", "#193441");

var color = d3.scale.threshold()
  .domain(thresholds)
  .range(d3.range(thresholds.length + 1).map(function(d, i) { return interpolateColor(i / thresholds.length); }));

var projection = d3.geo.albers()
    .rotate([0, 0])
    .center([8.3, 46.8])
    .scale(16000)
    .translate([width / 2, height / 2])
    .precision(.1);

var svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height);

var path = d3.geo.path()
        .projection(projection);

var map = svg.append("g");

q.queue()
    .defer(d3.json, "data/ch-contours.json")
    .defer(d3.json, "data/resort_centroids.json")
    .await(ready);

function ready(error, topology, centr) {
  if (error) throw error;

    // console.log(JSON.stringify(resortsdata));
    map.selectAll(".contour")
      .data(topojson.feature(topology, topology.objects.contours).features)
    .enter().append("path")
      .attr("class", "contour")
      .attr("d", path)
      .style("fill", function(d) { return color(d.id); })
      .style("stroke", function(d) { return d3.hcl(color(d.id)).brighter(); });

    svg.selectAll(".symbol")
        .data(centr.features)
      .enter().append("path")
        .attr("class", "symbol")
        .attr("d", path.pointRadius(function(d) { return 5; }));
}
