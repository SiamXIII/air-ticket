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
		'transferTime': 'Transfer time',
		'required': 'Field is required.',
		'minZero': 'This number must be more then 0.',
		'maxHundred': 'This number must be less then 100.',
		'number': 'Not valid number.',
		'patternInt': 'Not integer number.',
		'passengersRequired': 'Passengers are required.'
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
		'transferTime': 'Время пересадки',
		'required': 'Поле обязательно для заполнения.',
		'minZero': 'Это число должно быть больше 0.',
		'maxHundred': 'Это число должно быть меньше 100.',
		'number': 'Не правильное число.',
		'patternInt': 'Не целое число.',
		'passengersRequired': 'Отсутсвуют пассажиры.'
	});

	$translateProvider.preferredLanguage('en');

});