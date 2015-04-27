var http = require('http');
var dataAccessLayer = require('./data-access/data-access.js');

var port = process.env.port || 1337;
http.createServer(function (req, res) {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('Bye World\n');
}).listen(port);

console.log(dataAccessLayer.Flights.find({}));