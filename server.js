var url = require('url'),
    express = require('express'),
    short = require('short'),
    check = require('validator').check;

var defaults = {
    port: 3030
};

function init (conf) {

    conf = conf || defaults;
    
    short.connect("mongodb://localhost/short");

    var app = module.exports = express()
        .use(express.static(__dirname + '/app'))
        .use(express.bodyParser())
        .set('views', __dirname + '/app/views')
        .set('view engine', 'jade');
    app.locals({pretty: 'true'});

    app.get('/', front);
    app.post('/', submit);
    app.get('/s/*', submit);
    app.get('/p/*', preview);
    app.get('/dashboard', dashboard);
    app.get('/*', retrieve);

    return app;
}
    

// Front page
function front(req, res) {
    res.render('index', {date: new Date()});
}

// URL submission and API route
function submit(req, res) {
    if (req.url === '/favicon.ico') return;

    var URL;
    if (req.body.url != null){
        URL = req.body.url;
    } else {
        URL = req.url.slice(3);
    }

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
            var fullURL = req.protocol + "://" + req.get('host') + req.app.path() + '/' + shortURL.hash;

            if (ua.indexOf('curl') != -1){
                res.send("URL: " + fullURL + "\n");
            } else if (req.body.url != null) {
                res.render('submit', {url: fullURL, date: new Date()});
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
            var fullURL = req.protocol + "://" + req.get('host') + req.app.path() + '/' + shortURL.hash;
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

// Allow app to to run independently or mounted as a sub-app
if (require.main === module) {
    var app = init()
        .use(express.logger('dev'));

    app.locals({pretty: 'true'});

    app.listen(defaults.port);
}

module.exports = exports = init;
