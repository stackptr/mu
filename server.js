var url = require('url'),
    express = require('express'),
    short = require('short'),
    check = require('validator').check;

short.connect("mongodb://localhost/short");

var app = module.exports = express();

app.use(express.static(__dirname + '/');

// URL submission and API route
app.get('/s/*', function(req, res) {
    if (req.url === '/favicon.ico') return;

    var URL = req.url.slice(3);

    // Test URL for validity
    try {
        check(URL).isUrl();
    } catch (e) {
        return res.send(400, "Invalid URL");
    }

    var options = {length: 4};
    short.generate( URL, options, function(err, shortURL) {
        if (err) {
            return res.send(500);
        } else {
            var ua = req.get('user-agent');
            var fullURL = req.protocol + "://" + req.get('host') + '/' + shortURL.hash;

            if (ua.indexOf('curl') != -1){
                res.send("URL: " + fullURL + "\n");
            } else {
            }
        }
    });
});

// URL preview route
app.get('/p/*', function(req, res) {
    if (req.url === '/favicon.ico') return;

    var hash = req.url.slice(1);
    short.retrieve(hash, function (err, shortURL) {
        if (err) {
            return res.send(500);
        } else {
            var fullURL = req.protocol + "://" + req.get('host') + '/' + shortURL.hash;
            res.send("URL: " + fullURL + "\n");
        }
    });
});

// Dashboard route
app.get('/dashboard', function(req, res) {

});

// URL retrieval route
app.get('/*', function(req, res) {
    if (req.url === '/favicon.ico') return;

    var hash = req.url.slice(1);
    short.retrieve(hash, function (err, shortURL) {
        if (err) {
            return res.send(500);
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
