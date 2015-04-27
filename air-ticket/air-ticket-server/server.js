/// <reference path="typings/express/express.d.ts" />
/// <reference path="ticketDb.ts" />
var express = require('express');
var url = require("url");
var app = express();
app.get('/', function (req, res) {
    res.send('Hello World!');
});
function parseTiccketQuery(url) {
    var str = url.query;
    return new Db.TicketQuery();
}
app.get('/api/0.1.0/tickets', function (incomingMessage, serverResponse) {
    serverResponse.json(new Db.MongoTicketsDb().getTickets(parseTiccketQuery(url.parse(incomingMessage.url))));
    serverResponse.end();
});
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
