import { Node } from '../../models';

export default interface IPersonDisplayProps {
  handleAddChild: (n: Node) => void;
  handleAddParent: (n: Node) => void;
  handleEdit: (n: Node, update: Partial<Node>) => void;
  handleDelete: (n: Node) => void
  node?: Node;
};