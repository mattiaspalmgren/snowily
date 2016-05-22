// -- Inte react - browserify js/main.js > js/bundle.js
//watchify js/topo.js -o js/bundle.js -v
//supervisor server.js
//browserify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js
//watchify -t [ babelify --presets [ react ] ] js/main.js -o js/bundle.js

var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');
map = require('./map')
snowtypes = require('./snowtypes')

map.initMap();

  
var ResortRow = React.createClass({
  handleClick: function(resort) {
    map.clicked(resort);
    this.props.reset("");

  },
  render: function() {
    var name = this.props.resort.name;
    return (
      <li className="list-group-item" onClick={this.handleClick.bind(null, this.props.resort)}>{name}
        <span className="badge" style={{backgroundColor: this.props.resort.snowType.color}} ></span>
      </li>
    )
  }
});

var ResortList = React.createClass({
  render: function() {
    var rows = [];
    var arr = [];
    this.props.resorts.forEach(function(resort) {
      if(resort.name.toLowerCase().indexOf(this.props.filterText.toLowerCase()) === -1) {
        return;
      }
      arr.push(resort);
      rows.push(<ResortRow resort={resort} key={resort.name} reset={this.props.reset}/>);
    }.bind(this));

    map.filterResorts(arr);

    return (
      <ul className="list-group test">{rows}</ul>
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
    <div className="form-group has-feedback">
        <input 
                type="text" 
                className="form-control" 
                placeholder="Search" 
                aria-describedby="basic-addon1"
                value={this.props.filterText}
                ref="filterTextInput"
                onChange={this.handleChange}
        />
        <i className="glyphicon glyphicon-search form-control-feedback"></i>
    </div>
    );
  }
});
  
var ResortTable = React.createClass({
  getInitialState: function() {
    return {
      resorts: [],
      filterText: '',
      zoom: 0
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
      var snowArr = snowtypes.getSnowtypes();
      response1.forEach(function(resort){ resort.snowType = snowArr[Math.floor((Math.random() * snowArr.length))]});
      this.setState({resorts: response1})
    }.bind(this));
  },
  render: function() {
    return (
      <div>
        <SearchBar filterText={this.state.filterText} onUserInput={this.handleUserInput} />
        <ResortList resorts={this.state.resorts} filterText={this.state.filterText} reset={this.handleUserInput}/>
      </div>
    );
  }
});

ReactDOM.render(
  <ResortTable/>,
  document.getElementById('resort-table')
);


