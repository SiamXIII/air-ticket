angular.module('airTicketApp')
	.filter('localized', function() {
		return function(item, correction) {
			return moment(item).utc().add(correction, 'm').format('HH:mm');
		}
	}).filter('duration', function() {
		return function(miliseconds) {
			var milisecondsInHour = 1000 * 60 * 60;
			var milisecondsInMinute = 1000 * 60;
			var hours = miliseconds / milisecondsInHour;
			var minutes = (miliseconds - hours * milisecondsInHour) / milisecondsInMinute;
			minutes = minutes.toString();
			if (minutes.length === 1) {
				minutes = "0" + minutes;
			}
			var duration = hours + ":" + minutes;
			return duration;
		}
	});