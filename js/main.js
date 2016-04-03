//browserify js/main.js > js/bundle.js
//watchify js/main.js -o js/bundle.js -v
//supervisor server.js
// browserify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
var ReactBootstrap = require('react-bootstrap')
map = require('./map')

var ListGroup = ReactBootstrap.ListGroup, ListGroupItem= ReactBootstrap.ListGroupItem, Panel= ReactBootstrap.Panel;

var ResortTable = React.createClass({
  render: function() {
    return (
      <div>
        <Panel> 
          <h4 id="resortName">Ski resort</h4>
        <ListGroup fill>
          <ListGroupItem>
            <h5>Snow fall:</h5>
            <p id="snowFall"></p> 
          </ListGroupItem>
          <ListGroupItem>
            <h5>Chance of snow:</h5>
            <p id="chanceOfSnow"></p> 
          </ListGroupItem>
          <ListGroupItem>
            <h5>Temperature on the top:</h5>
            <p id="topTemp"></p> 
          </ListGroupItem>
          <ListGroupItem>
            <h5>Temperature on the bottom:</h5>
            <p id="bottomTemp"></p> 
          </ListGroupItem>
        </ListGroup>
        </Panel>
      </div>
    );
  }
});

var TwitterFeed = React.createClass({
  render: function() {
    return (
      <div>
        <Panel>
          <i className="fa fa-twitter"></i>
        </Panel>

        {this.props.feed.map(function(item) {
            return (
              <div className="col-md-12 tweet-item" key={item.imgUrl}>
                <img className="col-md-6"src={item.imgUrl}></img>
                <p className="col-md-6">{item.text}</p>
              </div>
            );
        })}
        
      </div>
      );
  }
});

ReactDOM.render(
  <ResortTable/>,
  document.getElementById('resort-table')
);

map.initMap(toggleFocus);

function toggleFocus(e) {
	
  	$("#resortName").text(e.target.options.title);    
  	var activeResort = findResort(e.target.options.title);

	  var req = activeResort.lat.toString().concat(",".concat(activeResort.lon.toString()));
  	var url = "http://api.worldweatheronline.com/free/v2/ski.ashx?key=" + cred.weather.key;
  	url = url.concat(req.concat("&format=json"))
  
  	$.ajax({
  		'url': url, 
  		'type': "GET", 
  		'success': function(d) {
  		   $("#bottomTemp").text(d.data.weather[0].bottom[0].mintempC);
  		   $("#topTemp").text(d.data.weather[0].top[0].mintempC);
  		   $("#snowFall").text(d.data.weather[0].totalSnowfall_cm); 
		     $("#chanceOfSnow").text(d.data.weather[0].chanceofsnow); 
  		 }
  	});

    var url = "?lon=" + activeResort.lon.toString() + "&" +"lat=" + activeResort.lat.toString();
      url = "http://localhost:8080/getTweets".concat(url);
      $.ajax({
      'url': url, 
      'type': "GET", 
      'success': function(d) {
          var f = d.statuses;
          if(f.length > 2)
            f = f.slice(0,3);

          function Tweet(text, imgUrl) {
              this.text = text;
              this.imgUrl = imgUrl;
          }

          function hasInstaImg(i) {
            if(i.entities.urls.length == 0)
              return false;
            var imgUrl = i.entities.urls[0].display_url;
            return (imgUrl.slice(0, 4) == "inst")
          }

          f = f.filter(hasInstaImg);
          var tweets = f.map(function(el, idx){
            var imgUrl = el.entities.urls[0].expanded_url;
            var instaUrl = "https://instagram.com/p/" + imgUrl.substr(28, imgUrl.length) + "media/?size=t";
            return new Tweet(el.text, instaUrl); 
          });

          ReactDOM.render(
            <TwitterFeed feed={tweets}/>,
            document.getElementById('twitter-feed')
          );
       }
    });  
}

function findResort(resortName) {
	for(var i = 0; i < map.resortData.length; i++) {
		if(resortName == map.resortData[i].name)
			return map.resortData[i];
	}
}

