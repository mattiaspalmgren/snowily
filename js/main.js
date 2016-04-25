// -- Inte react - browserify js/main.js > js/bundle.js
//watchify js/topo.js -o js/bundle.js -v
//supervisor server.js
//browserify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js
//watchify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
map = require('./map')
stats = require('./stats')
topomap = require('./topomap')

topomap.initMap();

var ResortTable = React.createClass({
  render: function() {
    return (
      <div className="panel panel-default"> 
        <div className="panel-heading">
          <h4>Verbier</h4>
        </div>
        <div className="panel-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mi mi, pretium id metus ac, dapibus maximus elit. Donec vel eros at risus facilisis imperdiet ac ut justo. Curabitur eget interdum sapien. Curabitur a tempus tortor. Sed hendrerit purus non luctus dignissim.
        </div>
        <div className="snowType">
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <ResortTable/>,
  document.getElementById('resort-table')
);

function findResort(resortName) {
	for(var i = 0; i < map.resortData.length; i++) {
		if(resortName == map.resortData[i].name)
			return map.resortData[i];
	}
}

