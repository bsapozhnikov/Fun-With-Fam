import DataStoreClient from './interface';

class MockDataStoreClient implements DataStoreClient {
  init() {}

  get() {
    var me = { name: "Brian", index: 0, root: false };
    var mom = { name: "Alla", index: 1, root: true };
    var momIsMom = { source: 1, target: 0 };
    var tree = { nodes: [me, mom], links: [momIsMom] };
    return tree;
  }

  post(req, res) {
    return;
  }
}

export default MockDataStoreClient;