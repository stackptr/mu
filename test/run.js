var express = require('express'),
    url     = require('../server');

// Define app and middleware
var app = express().use(express.logger('dev'));

// Define sample configuration
var config = {
	port: 3000,
	url: {
		locals: {
			pretty: "false"
		}
	}
};

// Define routes
app.use('/', url(config.url));

// Start
console.log("Server listening on port " + config.port);
app.listen(config.port, "127.0.0.1");
