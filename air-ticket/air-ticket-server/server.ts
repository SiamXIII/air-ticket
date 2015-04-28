/// <reference path="typings/express/express.d.ts" />
/// <reference path="ticketDb.ts" />
/// <reference path="custom_modules/air-ticket-server-interface/ticketQuery.ts" />
/// <reference path="TicketQueryMapper.ts" />

import express = require('express');
import url = require("url");

var app = express();

app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.get('/api/0.1.0/tickets', function (incomingMessage, serverResponse) {

	serverResponse.json(new Db.MongoTicketsDb().getTickets(
		TicketQueryMapper.map(AirTicketServerInterface.TicketQuery.ParseFromUrlQueryString(
			url.parse(incomingMessage.url).query))));

	serverResponse.end();
});

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});