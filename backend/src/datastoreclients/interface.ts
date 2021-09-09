import express from 'express';

interface DataStoreClient {
  get():any;
  post(req: express.Request, res: express.Response):void;
}

export default DataStoreClient;