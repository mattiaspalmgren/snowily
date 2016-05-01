dataFactory = require('../data/resorts-weather.js');
var resorts = dataFactory.getData();
var d3 = require('d3');
var geojson = require('geojson');
var q = require('d3-queue');
var topojson = require('topojson');
var $ = require('jquery');


var initMap = function() {

    var width = $("#map").width(),
        height = $("#map").height(),
        thresholds = [0.02, 0.04, 0.06, 0.08, 0.10],
        colors = ["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
        contour;

    // var interpolateColor = d3.interpolateHcl("#FCFFF5", "#193441");s
    // var color = d3.scale.threshold()
    //   .domain(thresholds)
    //   .range(d3.range(thresholds.length + 1).map(function(d, i) { return interpolateColor(i / thresholds.length); }));

    var color = d3.scale.threshold()
    .domain(thresholds)
    .range(colors);

    var projection = d3.geo.albers()
        .rotate([0, 0])
        .center([8.7, 46.8])
        .scale(10000)
        .translate([width / 2, height / 2])
        .precision(.1);

    var svg = d3.selectAll("#map").append("svg")
      .attr("width", width)
      .attr("height", height);

    // var xAxis_length = width*0.7;
    // var x = d3.scale.linear()
    //   .domain([0, 4500])
    //   .range([0, xAxis_length]);

    // var xAxis = d3.svg.axis()
    //   .scale(x)
    //   .orient("bottom")
    //   .tickSize(10)
    //   .tickFormat(d3.format(".0f"));

    var path = d3.geo.path()
            .projection(projection);

    var map = svg.append("g");

    // var key = svg.append("g")
    //   .attr("class", "key")
    //   .attr("transform", "translate(" + ((width - xAxis_length)/2) + "," + (height - 30) + ")");

    // key.append("rect")
    //   .attr("x", -10)
    //   .attr("y", -10)
    //   .attr("width", 310)
    //   .attr("height", 40)
    //   .style("fill", "white")
    //   .style("fill-opacity", 0.5)

    // key.selectAll(".band")
    //   .data(d3.pairs(x.ticks(10)))
    // .enter().append("rect")
    //   .attr("class", "band")
    //   .attr("height", 8)
    //   .attr("x", function(d) { return x(d[0]); })
    //   .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    //   .style("fill", function(d) { return color(d[0]); });

    // key.call(xAxis);

// Samnaun



    q.queue()
        .defer(d3.json, "data/ch-municipalities_mod.json")
        .defer(d3.json, "data/resort_centroids.json")
        .defer(d3.json, "data/ch-country.json")
        .await(ready);

    function ready(error, topology, centr, country) {
      if (error) throw error;
        
        var rateById = {};
        resorts.forEach(function(d) { rateById[d.name] = +d.temp; });
        
        map.selectAll(".country")
          .data(topojson.feature(country, country.objects.country).features)
        .enter().append("path")
          .attr("class", "contour")
          .attr("d", path)
          .style("fill", function(d) { return "white" })
          .style("stroke", function(d) { return "black" });

        map.selectAll(".contour")
          .data(topojson.feature(topology, topology.objects.municipalities).features)
        .enter().append("path")
          .attr("class", "contour")
          .attr("d", path)
          .style("fill", function(d) { return color(rateById[d.properties.name]) })
          .style("stroke", function(d) { return "#193441" });

        // svg.selectAll(".symbol")
        //     .data(centr.features)
        //   .enter().append("path")
        //     .attr("class", "symbol")
        //     .attr("d", path.pointRadius(function(d) { return 2; }));
    }

    function zoomed() {
      map.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
      contour.style("stroke-width", 0.5 / d3.event.scale);
    }


    function rand(){
      return thresholds[Math.floor((Math.random() * thresholds.length) + 1)];
    }
}

module.exports['initMap'] = initMap;
