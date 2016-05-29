var snowtypes = [{"id":0, "name": "powder", "color": "#FCFFF5"}, {"id":1, "name": "crud", "color" : "#ABADA6"}, {"id":2, "name": "crust", "color": "#EFECCA"}, {"id":3, "name": "slush", "color" : "#EFEC96"}];

function getResortWithSnowTypes(resort) {
	for (var i = 0; i < resort.vertices.length; i++) {
		resort.vertices[i].snow = snowtypes[Math.floor((Math.random() * snowtypes.length))];
	}

  // PSEUDO-CODE FOR SNOW CLASSIFICATION
  // var weather = getWeather(resort.vertices[i].lonLat);
  // if(weather.newSnow > 10 && (todayDate - weather.newSnow.date) < 2) && weather.temperature < 0 && !(weather.beenWarm)) {
  //   //Assign powder
  //   resort.vertices[i].snow = snowtypes[0];
  // } else if ((todayDate - weather.newSnow.date) > 2) && weather.temperature < 0 && !(weather.beenWarm))) {
  //   //Assign crud
  //   resort.vertices[i].snow = snowtypes[1];
  // } else if (weather.hasBeenSunny && weather.hasBeenWindy && weather.newSnow < 2 && weather.temperature < 0) {
  //   //Assign crust
  //   resort.vertices[i].snow = snowtypes[2];
  // } else {
  //   //Assign slush
  //   resort.vertices[i].snow = snowtypes[3];
  // };

	return resort;
}

function getSnowtypes() {
    return snowtypes;
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
          res.push({"start": tmpArr[i].start, "end": tmpArr[i].end, "snow": tmpArr[i].startSnow});
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
      var startSnowId = line.startSnow.id;
      var endSnowId = line.endSnow.id

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
        
        var newSnowId;
        if(endSnowId > startSnowId){newSnowId = startSnowId+i} else {newSnowId = startSnowId-i};
        // Here the face of the edge would effect the snowType in combination with the weather
        segments.push({"start": [oldX, y(oldX)], "end": [newX, y(newX)], "snow": snowtypes[newSnowId]});
      }

      return segments;

      function y(x) {
        return (k*(x - x1) + y1);
      }
    }
}

module.exports['getResortWithSnowTypes'] = getResortWithSnowTypes;
module.exports['createEdgeArray'] = createEdgeArray;
module.exports['getSnowtypes'] = getSnowtypes;

