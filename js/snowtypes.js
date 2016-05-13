var snowtypes = [{"id":0, "name": "powder", "color": "#D1DBBD"}, {"id":1, "name": "crud", "color" : "#FCFFF5"}, {"id":2, "name": "crust", "color": "#3E606F"}, {"id":3, "name": "powder", "color" : "#193441"}];

function getResortWithSnowTypes(resort) {
	for (var i = 0; i < resort.vertices.length; i++) {
		resort.vertices[i].snow = snowtypes[Math.floor((Math.random() * snowtypes.length))];
	}
	return resort;
}

// Help functions
function findVertex(arr, el) {
    for (var i = 0; i < arr.length; i++) {
        if(arr[i].name == el)
            return arr[i];
    }
    return -1;
}

function createEdgeArray(edgeArr, vertexArr, projection) {

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


module.exports['getResortWithSnowTypes'] = getResortWithSnowTypes;
module.exports['createEdgeArray'] = createEdgeArray;
