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
        
        var edgeArr = createEdgeArray(griments.edges, griments.vertices);
       
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
            .attr("stroke", "#91AA9D")
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
                    .style("opacity", op);

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

// Help functions

function findVertex(arr, el) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].name == el)
            return arr[i];
    }
    return -1;
}

function createEdgeArray(edgeArr, vertexArr) {

    //Create edgeArrar with included vertices
    var tmpArr = [];
    for (var i = 0; i < edgeArr.length; i++) {
        var s = findVertex(vertexArr, edgeArr[i].start);
        var start = projection(s.lonLat);
        var startSnow = s.snow;
        var e = findVertex(vertexArr, edgeArr[i].end);
        var end = projection(e.lonLat);
        var endSnow = e.snow;
        tmpArr.push({"start": start, "startSnow": startSnow, "end": end, "endSnow" :endSnow});
    }

    //Divide the edges into segments if different snow at endpoints 
    var res = [];
    for (var i = 0; i < tmpArr.length; i++) {
        var diff = Math.abs(tmpArr[i].endSnow.id-tmpArr[i].startSnow.id);
        if (!diff) {
          res.push({"start": tmpArr[i].start, "end": tmpArr[i].end, "snow": tmpArr[i].snow});
        } 
        else {
          var segments = createSegments(tmpArr[i], diff);   
          res = res.concat(segments);      
        }
    }

    return res;

    //Help function tp create the segments
    function createSegments(line, d) {
      var x1 = line.start[0];
      var y1 = line.start[1];
      var x2 = line.end[0];
      var y2 = line.end[1];

      var k = (y2-y1)/(x2-x1);
      var xRange = Math.abs(x2-x1);
      var xStep = xRange/(d+1);

      var segments = [];
      for (var i = 0; i < d+1; i++) {
        if((x2 - x1)>0) {
          var oldX = x1+(i*xStep);
          var newX = oldX+xStep;
        } else {
          var oldX = x1-(i*xStep);
          var newX = oldX-xStep;
        }
        segments.push({"start": [oldX, y(oldX)], "end": [newX, y(newX)], "snow": line.snow});
      }

      return segments;

      function y(x) {
        return (k*(x - x1) + y1);
      }
    }

}

module.exports['initMap'] = initMap;



















