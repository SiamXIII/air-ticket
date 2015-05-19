﻿angular.module('airTicketApp')
.config(function ($translateProvider) {
	$translateProvider.translations('en', {
		'forwardTrip': 'Forward Trip',
		'comebackTrip': 'Comeback Trip',
		'departureDate': 'Departure Date',
		'comebackDate': 'Return Date',
		'from': 'From',
		'to': 'To',
		'directions': 'Directions',
		'oneWay': 'One way',
		'twoWay': 'Two way',
		'adults': 'Adults',
		'children': 'Children',
		'babies': 'Infants',
		'search': 'Search',
		'searchParams': 'Search parameters',
		'filter': 'Filter',
		'departureTime': 'Departure Time',
		'comebackTime': 'Comeback Time',
		'morning': 'Morning',
		'day': 'Day',
		'evening': 'Evening',
		'flightList': 'List of Flights',
		'tripList': 'List of Trips',
		'order': 'Order',
		'details': 'Details',
		'hide': 'Hide',
		'departureFrom': 'Departure from',
		'arrivalTo': 'Arrival to',
		'vendor': 'Vendor',
		'flightCode': 'Flight ID',
		'departure': 'Departure',
		'comeback': 'Return',
		'selectOrigin': 'Select origin',
		'selectDestination': 'Select destination',
		'transferTime':'Transfer time'
	});

	$translateProvider.translations('ru', {
		'forwardTrip': 'Туда',
		'comebackTrip': 'Обратно',
		'departureDate': 'Дата отправления',
		'comebackDate': 'Дата возвращения',
		'from': 'Из',
		'to': 'В',
		'directions': 'Цель',
		'oneWay': 'В одну сторону',
		'twoWay': 'В обе стороны',
		'adults': 'Взрослые',
		'children': 'Дети',
		'babies': 'Младенцы',
		'search': 'Поиск',
		'searchParams': 'Параметры поиска',
		'filter': 'Фильтрация',
		'departureTime': 'Время отправления',
		'comebackTime': 'Время возвращения',
		'morning': 'Утро',
		'day': 'День',
		'evening': 'Вечер',
		'flightList': 'Список рейсов',
		'tripList': 'Список путешествий',
		'order': 'Заказать',
		'details': 'Подробнее',
		'hide': 'Спрятать',
		'departureFrom': 'Отправление из',
		'arrivalTo': 'Прибытие в',
		'vendor': 'Авиакомпания',
		'flightCode': 'Номер рейса',
		'departure': 'Отправление',
		'comeback': 'Возвращение',
		'selectOrigin': 'Пункт отправления',
		'selectDestination': 'Пункт назначения',
		'transferTime': 'Время пересадки'
	});

	$translateProvider.preferredLanguage('en');
	
});