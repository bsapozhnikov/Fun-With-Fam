import firebase from 'firebase';

import DataStoreClient from './interface';

class FirebaseDataStoreClient implements DataStoreClient {
  init() {
    var config = {
	apiKey: "AIzaSyDI0GmTHTm6F0SMgzzMR2RhVcLw_f5IxNg",
	authDomain: "fun-with-fam.firebaseapp.com",
	databaseURL: "https://fun-with-fam.firebaseio.com",
	storageBucket: "fun-with-fam.appspot.com",
    };
    firebase.initializeApp(config);
  }

  get() {
    var database = firebase.database();
    database.ref('/tree').once('value').then(function(snapshot) {
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

export default FirebaseDataStoreClient;