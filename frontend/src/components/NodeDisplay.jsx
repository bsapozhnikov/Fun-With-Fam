import React from 'react';
import EditableTextDisplay from './EditableTextDisplay';

class NodeDisplay extends React.Component {
    constructor(props) {
	super(props);
	this.handleAddChild = () => this.props.handleAddChild(this.props.node);
	this.handleEditName = (newName) => this.props.handleEdit(this.props.node, { name: newName });
	this.handleDelete = () => this.props.handleDelete(this.props.node);
	this.state = { isEditingName: false };
    }
    render() {
	if (this.props.node) {
	    return (<div>
	        <EditableTextDisplay text={this.props.node.name} handleEdit={this.handleEditName} />
		<button onClick={this.handleAddChild}>Add Child</button>
		<button onClick={this.handleDelete}>Delete</button>
		</div>);
	}
	else {
	    return (<div>NODE</div>);
	}
    }
}

export default NodeDisplay;
