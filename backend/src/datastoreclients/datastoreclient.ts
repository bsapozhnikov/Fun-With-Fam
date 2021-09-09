import express from 'express';

interface DataStoreClient {
  init():void;
  get():any;
  post(req: express.Request, res: express.Response):void;
}

export default DataStoreClient;