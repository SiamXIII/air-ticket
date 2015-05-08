var moment = require('moment')

var Flight = function (flightModel) {
	this.from = flightModel.from;
	this.getFlightTime= moment(this.arrivalTime).diff(moment(this.departureTime));
}

module.exports = Flight;