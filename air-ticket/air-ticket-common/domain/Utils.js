var AirTicket_Utils;

(function (AirTicket_Utils) {

	var DateTimeUtils = (function () {

		function DateTimeUtils() {
			
		}

		DateTimeUtils.changeUtcOffset = function(date, newUtcOffset) {
			var dateString = date.toString();
			var gmtIndex = dateString.lastIndexOf("GMT");
			var dateStringWithoutGmt = dateString.substring(0, gmtIndex);
			var dateStringWithNewGmt = dateStringWithoutGmt + "GMT" + newUtcOffset;
			return dateStringWithNewGmt;
		}

		DateTimeUtils.addOneDayWithoutOneMilisecond = function (date) {
			return new Date(date.valueOf() + (1000 * 60 * 60 * 24 - 1));
		}

		return DateTimeUtils;
	})();
	AirTicket_Utils.DateTimeUtils = DateTimeUtils;

})(AirTicket_Utils || (AirTicket_Utils = {}));

if (module && module.exports) {
	module.exports = AirTicket_Utils;
}