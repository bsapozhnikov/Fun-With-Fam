import React from 'react';
import EditableTextDisplay from '../EditableTextDisplay';

import { Node } from '../../models';

type HtmlAttributes = React.HTMLAttributes<HTMLDivElement>;

interface PersonDisplayProps {
  handleAddChild: (n: Node) => void;
  handleAddParent: (n: Node) => void;
  handleEdit: (n: Node, update: Partial<Node>) => void;
  handleDelete: (n: Node) => void
  node?: Node;
}

export default class extends React.Component<PersonDisplayProps & HtmlAttributes, {}> {
  handleAddChild: () => void;
  handleAddParent: () => void;
  handleEditName: (name: string) => void;
  handleEditRoot: () => void;
  handleDelete: () => void;
    constructor(props: PersonDisplayProps) {
	super(props);
	this.handleAddChild = () => this.props.node && this.props.handleAddChild(this.props.node);
	this.handleAddParent = () => this.props.node && this.props.handleAddParent(this.props.node);
	this.handleEditName = (newName) => this.props.node && this.props.handleEdit(this.props.node, { name: newName });
	this.handleEditRoot = () => this.props.node && this.props.handleEdit(this.props.node, { isRoot: !this.props.node.isRoot });
	this.handleDelete = () => this.props.node && this.props.handleDelete(this.props.node);
	this.state = { isEditingName: false };
    }
    render() {
	if (this.props.node) {
	    return (<div className={this.props.className}>
	        <EditableTextDisplay text={this.props.node.name} handleEdit={this.handleEditName} />
		<button onClick={this.handleAddChild}>Add Child</button>
		<button onClick={this.handleAddParent}>Add Parent</button>
		<button onClick={this.handleDelete}>Delete</button>
		<input type="checkbox" checked={this.props.node.isRoot} onChange={this.handleEditRoot}></input>Root
		</div>);
	}
	else {
	    return (<div className={this.props.className}>NODE</div>);
	}
    }
}