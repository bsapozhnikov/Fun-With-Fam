import React from 'react';
import EditableTextDisplay from '../EditableTextDisplay';
import IPersonDisplayProps from './IPersonDisplayProps';

type HtmlAttributes = React.HTMLAttributes<HTMLDivElement>;

export default class extends React.Component<IPersonDisplayProps & HtmlAttributes, {}> {
  handleAddChild: () => void;
  handleAddParent: () => void;
  handleEditName: (name: string) => void;
  handleDelete: () => void;
    constructor(props: IPersonDisplayProps) {
	super(props);
	this.handleAddChild = () => this.props.node && this.props.handleAddChild(this.props.node);
	this.handleAddParent = () => this.props.node && this.props.handleAddParent(this.props.node);
	this.handleEditName = (newName) => this.props.node && this.props.handleEdit(this.props.node, { name: newName });
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
		</div>);
	}
	else {
	    return (<div className={this.props.className}>NODE</div>);
	}
    }
}