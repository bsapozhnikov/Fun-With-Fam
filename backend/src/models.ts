class Node {
  static Empty: Node = { name: "", index: 0, root: false };
  name: string;
  index: number;
  root: boolean;

  constructor(nodeObj: Node) {
    Object.keys(Node.Empty).map(k => this[k] = nodeObj[k]);
  }
}

export class Tree {
  static Empty: Tree = { nodes: [], links: [] };
  nodes: Array<Node>;
  links: Array<any>;

  constructor(treeObj: Tree) {
    this.nodes = treeObj.nodes.map(n => new Node(n));
    this.links = treeObj.links;
  }
}