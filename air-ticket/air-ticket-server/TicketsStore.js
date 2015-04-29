var flightsDataAccess = require('./data-access/data-access.js').Flights;

var instance = {
    getAllTickets : function (callback) {
        flightsDataAccess.find({}, function (err, data) {
            callback(data);
        });
    },
    getTickets : function (ticketQuery) {
        return [
            {
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            }
        ];
    }
};

module.exports = function () {
    return instance;
}