mu-url - micro url shorterner
===

A simple URL shorterner app using short.js and Express. Goals include a RESTful API, dashboard, and authentication.

Usage:
```
node mu.js # run as standalone server

// Or as a mounted app in an Express server:
app.use('/url', require('mu-url')() );
```
