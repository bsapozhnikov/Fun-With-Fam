"use strict"

var express = require('express');
var http = require('http');
var https = require('https');
var firebase = require('firebase');
var bodyParser = require('body-parser');
const fs = require('fs');

class MockDataStoreClient {
  get() {
    var me = { name: "Brian" }
    var mom = { name: "Alla", root: true }
    var momIsMom = { source: 1, target: 0 }
    var tree = { nodes: [me, mom], links: [momIsMom] };
    return tree;
  }

  post(req, res) {
    return;
  }
}

class LocalDataStoreClient {
  get() {
    const rawData = fs.readFileSync('./tree.json');
    const tree = JSON.parse(rawData);
    return tree;
  }

  post(req, res) {
    const tree = req.body;
    tree.links.forEach((link) => {
      link.source = link.source.index || link.source;
      link.target = link.target.index || link.target;
    });
    console.log("POST", tree);
    const rawData = JSON.stringify(tree);
    fs.writeFileSync('./tree.json', rawData);
    return;
  }
}

class FirebaseDataStoreClient {
  get() {
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

  post(req, res) {
    var database = firebase.database();
    const key = database.ref('/tree/nodes').push(req.body).catch(function(e) {
	console.log(e);
    }).key;
    res.json({id: key});
  }
}

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
    // Initialize Firebase
    var config = {
	apiKey: "AIzaSyDI0GmTHTm6F0SMgzzMR2RhVcLw_f5IxNg",
	authDomain: "fun-with-fam.firebaseapp.com",
	databaseURL: "https://fun-with-fam.firebaseio.com",
	storageBucket: "fun-with-fam.appspot.com",
    };
    firebase.initializeApp(config);
});
