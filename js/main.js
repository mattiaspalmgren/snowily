// -- Inte react - browserify js/main.js > js/bundle.js
//watchify js/topo.js -o js/bundle.js -v
//supervisor server.js
//browserify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js
//watchify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
map = require('./map')

map.initMap();
  
var ResortRow = React.createClass({
  render: function() {
    var name = this.props.resort.name;
    return (
      <li>{name}</li>
    )
  }
});

var ResortList = React.createClass({
  render: function() {
    var rows = [];
    this.props.resorts.forEach(function(resort) {
      if(resort.name.indexOf(this.props.filterText) === -1) {
        return;
      }
      rows.push(<ResortRow resort={resort} key={resort.name} />);
    }.bind(this));

    return (
      <ul>{rows}</ul>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(
      this.refs.filterTextInput.value
    );
  },
  render: function() {
    return (
      <form>
        <input 
          type="text" 
          placeholder="Search..." 
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleChange}
        />
      </form>
    );
  }
});


var ResortTable = React.createClass({
  getInitialState: function() {
    return {
      resorts: [],
      filterText: ''
    }
  },
  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText
    });
  },
  componentDidMount: function() {
    this.serverRequest = $.when($.ajax("/data/resorts.json")).then(function(response1)
    { 
      this.setState({resorts: response1})
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
        <ResortList resorts={this.state.resorts} filterText={this.state.filterText}/>
      </div>
    );
  }
});
ReactDOM.render(
  <ResortTable/>,
  document.getElementById('resort-table')
);


