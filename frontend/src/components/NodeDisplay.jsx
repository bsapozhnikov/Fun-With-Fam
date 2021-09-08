import React from 'react';
import EditableTextDisplay from './EditableTextDisplay';

class NodeDisplay extends React.Component {
    constructor(props) {
	super(props);
	this.handleAddChild = () => this.props.handleAddChild(this.props.node);
	this.handleAddParent = () => this.props.handleAddParent(this.props.node);
	this.handleEditName = (newName) => this.props.handleEdit(this.props.node, { name: newName });
	this.handleEditRoot = () => this.props.handleEdit(this.props.node, { root: !this.props.node.root });
	this.handleDelete = () => this.props.handleDelete(this.props.node);
	this.state = { isEditingName: false };
    }
    render() {
	if (this.props.node) {
	    return (<div>
	        <EditableTextDisplay text={this.props.node.name} handleEdit={this.handleEditName} />
		<button onClick={this.handleAddChild}>Add Child</button>
		<button onClick={this.handleAddParent}>Add Parent</button>
		<button onClick={this.handleDelete}>Delete</button>
		<input type="checkbox" checked={this.props.node.root} onChange={this.handleEditRoot}></input>Root
		</div>);
	}
	else {
	    return (<div>NODE</div>);
	}
    }
}

export default NodeDisplay;
