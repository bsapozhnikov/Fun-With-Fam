"use strict"

import express from 'express';
import DataStoreClient from './datastoreclients/interface';
import LocalDataStoreClient from './datastoreclients/local';

var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');

var app = express();
app.use(express.json());

const dataStoreClient = new LocalDataStoreClient();

app.use(bodyParser.json());

app.all('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.get('/', (req, res) => {
    var data = dataStoreClient.get();
    if (data) {
	res.json(data);
    }
});

app.post('/', dataStoreClient.post);

app.listen(3000, () => {
    console.log('Listening!');
});