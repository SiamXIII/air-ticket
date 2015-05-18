angular.module('airTicketApp')
	.filter('localized', function() {
		return function(item, correction) {
			return moment(item).utc().add(correction, 'm').format('HH:mm');
		}
	});