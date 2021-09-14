import express from 'express';

import { Tree } from './../models';

interface DataStoreClient {
  get(): Tree;
  post(tree: Tree, res: express.Response): void;
}

export default DataStoreClient;