var url = require('url'),
    express = require('express'),
    short = require('short'),
    check = require('validator').check;

short.connect("mongodb://localhost/short");

var app = module.exports = express();

app.get('/s/*', submit);
app.get('/p/*', preview);
app.get('/dashboard', dashboard);
app.get('/*', retrieve);
    
app.listen(3030);

// URL submission and API route
function submit(req, res) {
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
                res.send({url: fullURL});
            }
        }
    });
}

// URL preview route
function preview(req, res) {
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
}

// Dashboard route
function dashboard(req, res) {

}

// URL retrieval route
function retrieve(req, res) {
    if (req.url === '/favicon.ico') return;

    var hash = req.url.slice(1);
    short.retrieve(hash, function (err, shortURL) {
        if (err) {
            return res.send(500);
        } else {
            if (shortURL) {
                res.redirect(shortURL.URL, 302);
            } else {
                return res.send(404);
            }
        }
    });
}

