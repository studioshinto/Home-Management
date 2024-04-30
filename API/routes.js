module.exports = function(app) {
	var room = require('./controller');

	app.route('/joinRoom')
    .get(room.findNewRoom)
    
	app.route('/rejoin')
	.get(room.rejoin)
};