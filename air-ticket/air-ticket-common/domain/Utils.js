var moment;

if (!moment) {
	moment = require("moment");
}

var AirTicket_Utils;

(function (AirTicket_Utils) {

	var DateTimeUtils = (function () {

		function DateTimeUtils() {
			
		}

		function pad(str, max) {
			str = str.toString();
			return str.length < max ? pad("0" + str, max) : str;
		}

		DateTimeUtils.setUtcOffset = function(date, newUtcOffset) {
			var dateString = date.toString();
			var gmtIndex = dateString.lastIndexOf("GMT");
			var dateStringWithoutGmt = dateString.substring(0, gmtIndex);

			var hours = pad((Math.abs(newUtcOffset) / 60).toString(), 2);
			var minutes = pad((Math.abs(newUtcOffset) % 60).toString(), 2);

			var utcOffsetString = "GMT" +
				(newUtcOffset > 0 ? "+" : "-") +
				hours +
				minutes;
			
			var dateStringWithNewGmt = dateStringWithoutGmt + utcOffsetString;
			return new Date(dateStringWithNewGmt);
		}

		DateTimeUtils.getHours = function (date, utcOffset) {
			var newDate = new Date(date + utcOffset * 60 * 1000);
			var hours = newDate.getUTCHours();
			return hours;
		}

		DateTimeUtils.getMinutes = function (date, utcOffset) {
			var newDate = new Date(date + utcOffset * 60 * 1000);
			var minutes = newDate.getUTCMinutes();
			return minutes;
		}

		DateTimeUtils.addDays = function (date, daysCount) {
			return new Date(date.valueOf() + (1000 * 60 * 60 * 24 * daysCount));
		}

		return DateTimeUtils;
	})();
	AirTicket_Utils.DateTimeUtils = DateTimeUtils;

})(AirTicket_Utils || (AirTicket_Utils = {}));

if (module && module.exports) {
	module.exports = AirTicket_Utils;
}