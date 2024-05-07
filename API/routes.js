module.exports = function(app) {
	//Person Routes
	var person = require('./controllers/person-controller');

	app.route('/person')
    .post(person.addNewPerson)
	
	app.route('/person/:personID')
    .post(person.updatePerson)
    
	app.route('/person/all')
	.get(person.getAllPeople)

	// Schedule Routes
	var schedule = require('./controllers/schedule-controller');

	app.route('/schedule')
	.get(schedule.getSchedule)
    .post(schedule.addUpdateSchedule)
};