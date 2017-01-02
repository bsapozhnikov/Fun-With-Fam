var express = require('express');
var app = express();

app.all('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.get('/', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.json({nodes: [{id: 0},{id: 1}], links: [{source: 0, target: 1}]});
});

app.listen(3000, () => {
    console.log('Listening!');   
});
