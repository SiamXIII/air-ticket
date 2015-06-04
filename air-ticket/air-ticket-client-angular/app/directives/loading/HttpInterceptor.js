angular.module('airTicketApp')
	.factory('HttpInterceptor', function ($q, $window) {
		return {
			'request': function (request) {
				if (request.action == 'trips') {
					$('.trips').show();
				}
				else if (request.action == 'locations') {
					$('.locations').show();
				}

				return request;
			},
			'response': function (response) {
				if (response.config.action == 'trips') {
					$('.trips').hide();
				}
				else if (response.config.action == 'locations') {
					$('.loading.locations').hide();
				}

				return response;
			}
		}
	});