import fs from 'fs';
import DataStoreClient from './interface';
import { Tree } from '../models';

class LocalDataStoreClient implements DataStoreClient {
  init() {}

  get() {
    const rawData = fs.readFileSync('./tree.json').toString();
    const tree = JSON.parse(rawData);
    console.log("backend got data", tree);
    return tree;
  }

  post(tree : Tree, res) {
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