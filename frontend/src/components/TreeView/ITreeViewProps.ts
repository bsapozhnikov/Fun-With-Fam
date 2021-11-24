import { Node, Tree } from '../../models';

export default interface ITreeViewProps {
  data: Tree;
  handleNodeClick: (node: Node) => void;
}