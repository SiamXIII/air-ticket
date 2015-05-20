angular.module('airTicketApp')
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

		function mapRouteToViewModel(route) {
			var flightViewModels = [];
			var flightCount = route.getFlightsCount();

			for (var i = 0; i < flightCount; i++) {
				var flight = route.getFlight(i);

				flightViewModels.push(mapFlightToViewModel(flight));

				if (i != flightCount - 1) {
					flightViewModels[i].transferDurationAfterFlight = route.getTransferDurationAfterFlight(flight.getCode());
				}
			}

			var result = {
				from: mapLocationToViewModel(route.getFromLocation()),
				to: mapLocationToViewModel(route.getToLocation()),
				departureTime: route.getDepartureTime(),
				arrivalTime: route.getArrivalTime(),
				duration: route.getDuration(),
				flights: flightViewModels,
				price: route.getAdultPrice(),
				departureTimeHoursLocal: AirTicket_Utils.DateTimeUtils.getHours(route.getDepartureTime(), route.getFromLocation().getTimeZoneOffset()),
			};

			return result;
		}

		function mapTripToViewModel(trip) {
			var result = {
				from: mapLocationToViewModel(trip.getFromLocation()),
				to: mapLocationToViewModel(trip.getToLocation()),
				forwardRoute: mapRouteToViewModel(trip.getForwardRoute()),
				backRoute: trip.getBackRoute() ? mapRouteToViewModel(trip.getBackRoute()) : null,
				price: trip.getPrice(),
				adults: trip.getAdults(),
				children: trip.getChildren(),
				infants: trip.getInfants()
			};

			return result;
		}

		return mapTripToViewModel;
	});