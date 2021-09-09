import express from 'express';

import { Tree } from './../models';

interface DataStoreClient {
  get(): Tree;
  post(req: express.Request, res: express.Response): void;
}

export default DataStoreClient;