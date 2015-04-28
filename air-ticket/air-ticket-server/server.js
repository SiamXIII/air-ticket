/// <reference path="typings/tsd.d.ts" />
var express = require('express');
var url = require("url");
var AirTicketServerInterface = require("./custom_modules/air-ticket-server-interface/AirTicketServerInterface");
var TicketsStore = require("./TicketsStore");
var QueryMapper = require("./TicketQueryMapper");
var app = express();
app.get('/', function (req, res) {
    res.send('Hello World!');
});
app.get('/api/0.1.0/tickets', function (incomingMessage, serverResponse) {
    serverResponse.setHeader('Access-Control-Allow-Origin', "http://localhost:52923");
    serverResponse.json(new TicketsStore.MongoTicketsDb().getTickets(QueryMapper.map(AirTicketServerInterface.TicketQuery.parseFromUrlQueryArg(url.parse(incomingMessage.url).query))));
    serverResponse.end();
});
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
//# sourceMappingURL=server.js.map