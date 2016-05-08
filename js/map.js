var d3 = require('d3');
var geojson = require('geojson');
var q = require('d3-queue');
var topojson = require('topojson');
var $ = require('jquery');

var width = $("#map").width(),
    height = $("#map").height(),
    colors = ["#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"],
    centered;

var projection = d3.geo.albers()
    .rotate([0, 0])
    .center([8.55, 46.8])
    .scale(9000)
    .translate([width / 2, height / 2])
    .precision(.1);

var svg = d3.selectAll("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

var path = d3.geo.path()
        .projection(projection);

var map = svg.append("g");


var initMap = function() {

    
    q.queue()
        .defer(d3.json, "data/griments.json")
        .defer(d3.json, "data/resorts.json")
        .defer(d3.json, "data/ch-country.json")
        .await(ready);

    function ready(error, griments, resorts, country) {
      if (error) throw error;

        var griments = griments[0];
        var edgeArr = createEdgeArray(griments.edges, griments.vertices);
        
        map.selectAll(".country")
          .data(topojson.feature(country, country.objects.country).features)
        .enter().append("path")
          .attr("class", "contour")
          .attr("d", path)
          .style("fill", "#DCEAF2")
          .style("stroke", "black");

        map.selectAll("line")
            .data(edgeArr)
            .enter()
            .append("line")
            .attr("x1", function(d) { return d.start[0]})   
            .attr("y1", function(d) { return d.start[1]})   
            .attr("x2", function(d) { return d.end[0]})     
            .attr("y2", function(d) { return d.end[1]})
            .attr("stroke-width", 2)
            .attr("stroke", "#91AA9D");

        map.selectAll("resorts")
            .data(resorts).enter()
            .append("rect")
            .attr("x", function (d) { return projection(d.lonLat)[0]; })
            .attr("y", function (d) { return projection(d.lonLat)[1]; })
            .attr("width", 10)
            .attr("height", 10)
            .on("click", clicked);

        map.selectAll("rects")
            .data(griments.vertices).enter()
            .append("rect")
            .attr("class", function(d) { return d.name})
            .attr("x", function (d) { return projection(d.lonLat)[0]-0.0625; })
            .attr("y", function (d) { return projection(d.lonLat)[1]-0.0625; })
            .attr("width", 10)
            .attr("height", 10)
            .on("click", clicked);

    }

}

// Help functions

function clicked(d) {
    var x, y, k, dur;
    if (d && centered !== d) {
        var centroid = projection(d.lonLat);
        x = centroid[0];
        y = centroid[1];
        k = 80;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

    if(k == 80) { w = 0.2; dur = 500 } else { w = 10; dur = 1000 }
    map.selectAll("rect").transition()
        .duration(dur)
        .ease("cubic-in-out")
        .attr("width", w)
        .attr("height", w);

    map.selectAll("line").transition()
        .duration(dur)
        .ease("cubic-in-out")
        .attr("stroke-width", 0.6)

    map.transition()
      .duration(750)
      .ease("cubic-in-out")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

};

function findVertex(arr, el) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].name == el)
            return arr[i].lonLat;
    }
    return -1;
}

function createEdgeArray(edgeArr, vertexArr) {

    var res = [];
    for (var i = 0; i < edgeArr.length; i++) {
        
        var start = findVertex(vertexArr, edgeArr[i].start);
        start = projection(start);

        var end = findVertex(vertexArr, edgeArr[i].end);
        end = projection(end);
        
        res.push({start, end});
    }
    return res;
}

module.exports['initMap'] = initMap;





















