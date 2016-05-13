var d3 = require('d3');
var q = require('d3-queue');
var topojson = require('topojson');
var $ = require('jquery');
snowtypes = require('./snowtypes');


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

    function ready(error, grimentsStatic, resorts, country) {
      if (error) throw error;

        griments = grimentsStatic[0];
        var griments = snowtypes.getResortWithSnowTypes(griments);
        
        var edgeArr = snowtypes.createEdgeArray(griments.edges, griments.vertices, projection);
       
        // Draws the country lines
        map.selectAll(".country")
          .data(topojson.feature(country, country.objects.country).features)
        .enter().append("path")
          .attr("class", "contour")
          .attr("d", path)
          .style("fill", "#DCEAF2")
          .style("stroke", "black");

        //Draws all the resort
        map.selectAll("resorts")
            .data(resorts).enter()
            .append("rect")
            .attr("class", "resort")
            .attr("x", function (d) { return projection(d.lonLat)[0]; })
            .attr("y", function (d) { return projection(d.lonLat)[1]; })
            .attr("width", 10)
            .attr("height", 10)
            .on("click", clicked);

        //Draws the snowareas in forms of lines for Griments
        map.selectAll("line")
            .data(edgeArr)
            .enter()
            .append("line")
            .attr("x1", function(d) { return d.start[0]})   
            .attr("y1", function(d) { return d.start[1]})   
            .attr("x2", function(d) { return d.end[0]})     
            .attr("y2", function(d) { return d.end[1]})
            .attr("stroke-width", 0.5)
            .attr("stroke", function(d) {return d3.rgb(d.snow.color).brighter(0.5)})
            .style("opacity", 0);

        //Draws the vertices for griments
        map.selectAll("griments")
           .data(griments.vertices).enter()
           .append("rect")
           .attr("class", "grimentz")
           .attr("x", function (d) { return projection(d.lonLat)[0]-0.0625; })
           .attr("y", function (d) { return projection(d.lonLat)[1]-0.0625; })
           .attr("fill", function (d) { return d.snow.color})
           .attr("width", 0.2)
           .attr("height", 0.2)
           .style("opacity", 0)
           .on("click", clicked);


            //Function to handle the zoom
            function clicked(d) {
                var x, y, k, dur, op;
                
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

                op = (k == 80) ? 1 : 0;
                map.selectAll(".grimentz")
                    .transition()
                    .duration(750)
                    .style("opacity", op);

                map.selectAll("line")
                    .transition()
                    .duration(750)
                    .style("opacity", op-0.2);

                map.selectAll(".resort")
                    .transition()
                    .duration(750)
                    .style("opacity", function() {if(op){return 0} else{return 1} });
                
                map.transition()
                  .duration(750)
                  .ease("cubic-in-out")
                  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                  .style("stroke-width", 1.5 / k + "px");

            };        
    }
}


module.exports['initMap'] = initMap;



















