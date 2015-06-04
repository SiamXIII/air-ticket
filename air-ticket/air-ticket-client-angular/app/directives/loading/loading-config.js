angular.module('airTicketApp')
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('HttpInterceptor');
	});