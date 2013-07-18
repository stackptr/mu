var app = require('express')();

app.use('/mu', require('./server'));

app.listen(4030);
