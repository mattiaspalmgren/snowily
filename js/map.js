var d3 = require('d3');
var q = require('d3-queue');
var topojson = require('topojson');
var $ = require('jquery');
snowtypes = require('./snowtypes');
data = require('./data');

var thresholds = [500, 1000, 1500, 2000, 2500, 3000, 3500, 4000],
    contour;

var interpolateColor = d3.interpolateHcl("#455950", "#DFF0F2");

var color = d3.scale.threshold()
  .domain(thresholds)
  .range(d3.range(thresholds.length + 1).map(function(d, i) { return interpolateColor(i / thresholds.length); }));

var width = $("#map").width(),
    height = $("#map").height(),
    centered;

projection = d3.geo.albers()
    .rotate([0, 0])
    .center([8.72, 47])
    .scale(14000)
    .translate([960/2, 500/2])
    .precision(.1);

var null_path = d3.geo.path()
  .projection(null);

var svg = d3.selectAll("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

var path = d3.geo.path()
        .projection(projection);

var map = svg.append("g");
var zoom = false;
var initAxis = function() {

    var axisWidth = 310;
  
    var x = d3.scale.linear()
      .domain([0, 4500])
      .range([0, 280]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(10)
      .tickFormat(d3.format(".0f"));

    var backBtn = svg.append("g");
    backBtn.append("rect")
          .attr("x", 20)
          .attr("y", 20)
          .attr("class", "back")
          .attr("width", 40)
          .attr("height", 40)
          .style("fill", "white")
          .style("fill-opacity", 0)
          .on("click", clicked);

    backBtn.append("text")
      .attr("x", 40)           
      .attr("y", 40)
      .attr("class", "back")           
      .attr("dy", ".35em")
      .attr('font-family', 'FontAwesome')           
      .attr("text-anchor", "middle")  
      .text(function() {return '\uf00d';})
      .style("fill-opacity", 0)
      .on("click", clicked); ;

    var key =  svg.append("g")
      .attr("class", "key")
      .attr("transform", "translate(" + (width - 320) + "," + (height - 50) + ")");

    key.append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", axisWidth)
      .attr("height", 40)
      .style("fill", "white")
      .style("fill-opacity", 0.5)

    key.selectAll(".band")
      .data(d3.pairs(x.ticks(10)))
    .enter().append("rect")
      .attr("class", "band")
      .attr("height", 8)
      .attr("x", function(d) { return x(d[0]); })
      .attr("width", function(d) { return x(d[1]) - x(d[0]); })
      .style("fill", function(d) { return color(d[0]); });

    key.call(xAxis);


    var margin = 5;
    var padding = 10;
    var snows = snowtypes.getSnowtypes().reverse(); 
    var rectW = (axisWidth-2*padding-(3*margin))/4;

    var type =  svg.append("g")
      .attr("class", "type")
      .attr("transform", "translate(" + (width - 320) + "," + (height - 90) + ")");

    type.append("rect")
      .attr("x", -padding)
      .attr("y", -padding)
      .attr("width", axisWidth)
      .attr("height", 40)
      .style("fill", "white")
      .style("fill-opacity", 0.5);

    type.selectAll(".type")
      .data(snows).enter()
      .append("rect")
      .attr("class", function(d) { return d.name})
      .attr("height", 30)
      .attr("x", function(d) {return d.id*(margin+rectW) })
      .attr("width", rectW)
      .attr("fill", function(d) {return d.color});

    type.selectAll(".text")
      .data(snows).enter()
      .append("text")
      .attr("x", function(d) {return d.id*(margin+rectW)+rectW/2})           // set x position of left side of text
      .attr("y", 15)           
      .attr("dy", ".35em")           
      .attr("text-anchor", "middle")  
      .text(function(d) {return d.name})



    function getRect(className) {
      return type.select('.' + className);
    }
}

var initMap = function() {

    q.queue()
        .defer(d3.json, "data/griments.json")
        .defer(d3.json, "data/resorts.json")
        .defer(d3.json, "data/ch-contours.json")
        .await(ready);

    function ready(error, grimentsStatic, resorts, topology) {
        if (error) throw error;

        griments = grimentsStatic[0];
        var griments = snowtypes.getResortWithSnowTypes(griments);
        var edgeArr = snowtypes.createEdgeArray(griments.edges, griments.vertices, projection);
        var snowArr = snowtypes.getSnowtypes();
        resorts.forEach(function(resort){ resort.snowType = snowArr[Math.floor((Math.random() * snowArr.length))]});

        map.selectAll(".contour")
            .data(topojson.feature(topology, topology.objects.contours).features)
          .enter().append("path")
            .attr("class", "contour")
            .attr("d", null_path)
            .style("fill", function(d) { return color(d.id); })
            .style("stroke", function(d) { return d3.hcl(color(d.id)).brighter(); });

          //Draws all the resort
        map.selectAll("resorts")
              .data(resorts).enter()
              .append("rect")
              .attr("class", function(d) {return ("id-" + d.id)})
              .attr("x", function (d) { return projection(d.lonLat)[0]; })
              .attr("y", function (d) { return projection(d.lonLat)[1]; })
              .attr("width", 10)
              .attr("height", 10)
              .attr("fill", function(d) {return d.snowType.color})
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

        initAxis();     
    }
}

//Function to handle the zoom
var clicked = function (d) {

    var x, y, k, dur, op;
    
    if (d && centered !== d) {
        var centroid = projection(d.lonLat);
        x = centroid[0];
        y = centroid[1];
        k = 60;
        centered = d;
        zoom = true;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
        zoom = false;
    }

    op = (k == 60) ? 1 : 0;
    svg.selectAll(".back")
        .transition()
        .duration(600)
        .style("fill-opacity", function() { if(op == 0) {return op} else { return (op-0.3)}});

    map.selectAll(".grimentz")
        .transition()
        .duration(600)
        .style("opacity", op);

    map.selectAll("line")
        .transition()
        .duration(600)
        .style("opacity", op-0.2);

    map.selectAll("[class^='id']")
        .transition()
        .duration(600)
        .style("opacity", function() {if(op){return 0} else{return 1} });
    
    map.transition()
      .duration(600)
      .ease("cubic-in-out")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");

}; 

var allResorts = data.getResorts();
var filterResorts = function (activeResorts) {
    for (var i = 0; i < allResorts.length; i++) {
      map.selectAll('.' + "id-" + allResorts[i].id)
      .transition()
      .duration(50)
      .style("opacity", 0);
    }
   
   if(!zoom && activeResorts.length>0){
    for (var i = 0; i < activeResorts.length; i++) {
      map.selectAll('.' + "id-" + activeResorts[i].id)
      .transition()
      .duration(50)
      .style("opacity", 1);
    }
   }  
}

module.exports['initMap'] = initMap;
module.exports['filterResorts'] = filterResorts;
module.exports['clicked'] = clicked;






















