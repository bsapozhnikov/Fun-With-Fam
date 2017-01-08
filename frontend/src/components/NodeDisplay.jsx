import React from 'react';

class NodeDisplay extends React.Component {
    constructor(props) {
	super(props);
	this.handleAddChild = () => this.props.handleAddChild(this.props.node);
	this.handleDelete = () => this.props.handleDelete(this.props.node);
    }
    render() {
	if (this.props.node) {
	    return (<div>
	    {this.props.node.name}
		<button onClick={this.handleAddChild}>Add Child</button>
		<button onClick={this.handleDelete}>Delete</button>
		</div>);
	}
	else {
	    return (<div>NODE</div>);
	    
	}
    }
}

module.exports = NodeDisplay;
