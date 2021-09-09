import fs from 'fs';

import DataStoreClient from './interface';

class LocalDataStoreClient implements DataStoreClient {
  init() {}

  get() {
    const rawData = fs.readFileSync('./tree.json').toString();
    const tree = JSON.parse(rawData);
    return tree;
  }

  post(req, res) {
    const tree = req.body;
    tree.links.forEach((link) => {
      link.source = link.source.index ?? link.source;
      link.target = link.target.index ?? link.target;
    });
    console.log("POST", tree);
    const rawData = JSON.stringify(tree);
    fs.writeFileSync('./tree.json', rawData);
    return;
  }
}

export default LocalDataStoreClient;