import DataStoreClient from './interface';

class MockDataStoreClient implements DataStoreClient {
  init() {}

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

export default MockDataStoreClient;