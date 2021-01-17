"use strict"

var express = require('express');
var http = require('http');
var https = require('https');
var firebase = require('firebase');
var bodyParser = require('body-parser');

var app = express();

const shouldUseMockData = true;

app.use(bodyParser.json());

app.all('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.get('/', (req, res) => {
    var data = getData(shouldUseMockData);
    if (data) {
	res.json(data);
    }
});

app.post('/', (req, res) => {
    if (shouldUseMockData) { return }
    var database = firebase.database();
    const key = database.ref('/tree/nodes').push(req.body).catch(function(e) {
	console.log(e);
    }).key;
    res.json({id: key});
});

app.listen(3000, () => {
    console.log('Listening!');
    // Initialize Firebase
    var config = {
	apiKey: "AIzaSyDI0GmTHTm6F0SMgzzMR2RhVcLw_f5IxNg",
	authDomain: "fun-with-fam.firebaseapp.com",
	databaseURL: "https://fun-with-fam.firebaseio.com",
	storageBucket: "fun-with-fam.appspot.com",
    };
    firebase.initializeApp(config);
});

function getData(shouldReturnMockData) {
    return shouldReturnMockData ? getMockData() : getFirebaseData()
}

function getMockData() {
    var me = { name: "Brian" }
    var mom = { name: "Alla", root: true }
    var momIsMom = { source: 1, target: 0 }
    var tree = { nodes: [me, mom], links: [momIsMom] };
    return tree;
}

function getFirebaseData() {
    var database = firebase.database();
    database.ref('/tree').once('value').then(function(snapshot) {
 	res.header('Content-Type', 'application/json');
 	const tree = snapshot.val();
 	tree.nodes = Object.keys(tree.nodes).map((key) => tree.nodes[key]);
	return tree;
    }).catch(function(e) {
 	console.log(e);
    });
}
