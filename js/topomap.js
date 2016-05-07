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
        snowtypes = ["SLUSH", "CRUSH", "CRUD", "POWDER"],
        thresholds = [0.2, 0.4, 0.6, 0.8],
        colors = ["#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
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
    //   .domain([0, 1])
    //   .range([0, xAxis_length]);

    // var xAxis = d3.svg.axis()
    //   .scale(x)
    //   .orient("bottom")
    //   .tickSize(10)
    //   .tickFormat(d3.format("s"));

    var path = d3.geo.path()
            .projection(projection);

    var map = svg.append("g");

    var key = svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(" + width + "," + (height - 30) + ")");

    var rectW = 80;
    var rectH = 50;
    var rectangle = svg.selectAll(".rects")
        .data(snowtypes)
        .enter()
        .append("rect")
        .attr("width", rectW)//
        .attr("height", rectH)
        .attr("x",function(d,i){return 130+i*rectW*1.2;})
        .attr("y", height-rectH)
        .attr("fill", function(d, i) {return colors[i+1]})

    var texts = svg.selectAll(".texts")
        .data(snowtypes)
        .enter()
        .append("text")
        .attr("width", rectW)
        .attr("height", 20)
        .attr("x",function(d,i){return 130+i*rectW*1.2+5;})
        .attr("y", height-20)
        .attr("fill", "white")
        .text(function(d) {return d})
        .style("font-size",15)
        .style("font-weight", "bold");

    // key.selectAll(".band")
    //   .data(d3.pairs(x.ticks(10)))
    // .enter().append("rect")
    //   .attr("class", "band")
    //   .attr("height", 7)
    //   .attr("x", function(d) { return x(d[0]); })
    //   .attr("width", function(d) { return x(d[1]) - x(d[0]); })
    //   .style("fill", function(d) { return color(d[0]); });

    // key.call(xAxis);

    q.queue()
        .defer(d3.json, "data/ch-municipalities_mod.json")
        .defer(d3.json, "data/resort_centroids.json")
        .defer(d3.json, "data/ch-country.json")
        .await(ready);

    function ready(error, topology, centr, country) {
      if (error) throw error;
        
        var rateById = {};
        resorts.forEach(function(d) { rateById[d.name] = +d.temp*10; });
        
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
