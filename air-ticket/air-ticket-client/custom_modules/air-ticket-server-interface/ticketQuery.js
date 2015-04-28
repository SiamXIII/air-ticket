var AirTicketServerInterface;
(function (AirTicketServerInterface) {
    (function (SortDirection) {
        SortDirection[SortDirection["Asc"] = 0] = "Asc";
        SortDirection[SortDirection["Desc"] = 1] = "Desc";
    })(AirTicketServerInterface.SortDirection || (AirTicketServerInterface.SortDirection = {}));
    var SortDirection = AirTicketServerInterface.SortDirection;
    ;
    var SortSetting = (function () {
        function SortSetting() {
        }
        return SortSetting;
    })();
    AirTicketServerInterface.SortSetting = SortSetting;
    var PageSetting = (function () {
        function PageSetting(pageSize, pageNumber) {
            this.pageSize = pageSize;
            this.pageNumber = pageNumber;
        }
        return PageSetting;
    })();
    AirTicketServerInterface.PageSetting = PageSetting;
    var TicketQuery = (function () {
        function TicketQuery() {
        }
        TicketQuery.prototype.toUrlQueryArg = function () {
            return encodeURIComponent(JSON.stringify(this));
        };
        TicketQuery.parseFromUrlQueryArg = function (urlQueryString) {
            return JSON.parse(decodeURI(urlQueryString));
        };
        return TicketQuery;
    })();
    AirTicketServerInterface.TicketQuery = TicketQuery;
})(AirTicketServerInterface || (AirTicketServerInterface = {}));
