var url = require('url'),
    express = require('express'),
    short = require('short');

short.connect("mongodb://localhost/short");

var app = module.exports = express();

// URL submission route
app.get('/s/*', function(req, res) {
    if (req.url === '/favicon.ico') return;

    var URL = req.url.slice(3);
    var options = {length: 4};
    short.generate( URL, options, function(err, shortURL) {
        if (err) {
            res.writeHeader(500).end();
        } else {
            var fullURL = req.protocol + "://" + req.get('host') + '/' + shortURL.hash;
            res.send("URL: " + fullURL + "\n");
        }
    });
});

// URL preview route

// Dashboard route

// URL retrieval route
app.get('/*', function(req, res) {
    if (req.url === '/favicon.ico') return;

    var hash = req.url.slice(10:
    short.retrieve(hash, function (err, shortURL) {
        if (err) {
            res.writeHeader(500).end();
        } else {
            if (shortURL) {
                res.redirect(shortURL.URL, 302);
            } else {
                res.writeHeader(404).end();
            }
        }
    });
});

app.listen(3030);
