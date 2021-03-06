﻿angular.module('airTicketApp')
	.factory('mapTripToViewModel', function () {
		function mapLocationToViewModel(location) {
			var result = {
				code: location.getCode(),
				fullName: location.getFullName(),
				timeZoneOffset: location.getTimeZoneOffset()
			};

			return result;
		}

		function mapFlightToViewModel(flight) {
			var result = {
				from: mapLocationToViewModel(flight.getFromLocation()),
				to: mapLocationToViewModel(flight.getToLocation()),
				departureTime: flight.getDepartureTime(),
				arrivalTime: flight.getArrivalTime(),
				duration: flight.getDuration(),
				code: flight.getCode(),
				vendorCode: flight.getVendorCode(),
				price: flight.getAdultPrice()
			};

			return result;
		}

		function mapFlightChainToViewModel(flightChain) {
			var flightViewModels = [];
			var flightCount = flightChain.getFlightsCount();

			for (var i = 0; i < flightCount; i++) {
				var flight = flightChain.getFlight(i);

				flightViewModels.push(mapFlightToViewModel(flight));

				if (i !== flightCount - 1) {
					flightViewModels[i].transferDurationAfterFlight = flightChain.getTransferDurationAfterFlight(flight.getCode());
				}
			}

			var result = {
				from: mapLocationToViewModel(flightChain.getFromLocation()),
				to: mapLocationToViewModel(flightChain.getToLocation()),
				departureTime: flightChain.getDepartureTime(),
				arrivalTime: flightChain.getArrivalTime(),
				duration: flightChain.getDuration(),
				flights: flightViewModels,
				price: flightChain.getAdultPrice(),
				departureTimeHoursLocal: AirTicket_Utils.DateTimeUtils.getHours(flightChain.getDepartureTime(), flightChain.getFromLocation().getTimeZoneOffset()),
			};

			return result;
		}

		function mapTripToViewModel(trip) {
			var result = {
				from: mapLocationToViewModel(trip.getFromLocation()),
				to: mapLocationToViewModel(trip.getToLocation()),
				forwardFlightChain: mapFlightChainToViewModel(trip.getForwardFlightChain()),
				backFlightChain: trip.getBackFlightChain() ? mapFlightChainToViewModel(trip.getBackFlightChain()) : null,
				price: trip.getPrice(),
				adults: trip.getAdults(),
				children: trip.getChildren(),
				infants: trip.getInfants()
			};

			return result;
		}

		return mapTripToViewModel;
	});