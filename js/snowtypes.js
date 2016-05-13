var snowtypes = [{"id":0, "name": "powder", "color": "#D1DBBD"}, {"id":1, "name": "crud", "color" : "#FCFFF5"}, {"id":2, "name": "crust", "color": "#3E606F"}, {"id":3, "name": "powder", "color" : "#193441"}];

function getResortWithSnowTypes(resort) {
	for (var i = 0; i < resort.vertices.length; i++) {
		resort.vertices[i].snow = snowtypes[Math.floor((Math.random() * snowtypes.length))];
	}
	return resort;
}

module.exports['getResortWithSnowTypes'] = getResortWithSnowTypes;
