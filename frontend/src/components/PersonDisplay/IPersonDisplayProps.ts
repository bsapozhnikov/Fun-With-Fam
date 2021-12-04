import { Node } from '../../models';

export default interface IPersonDisplayProps {
  handleAddNewChild: (n: Node) => void;
  handleAddExistingAsChild: () => void;
  handleAddParent: (n: Node) => void;
  handleEdit: (n: Node, update: Partial<Node>) => void;
  handleDelete: (n: Node) => void
  node?: Node;
};
