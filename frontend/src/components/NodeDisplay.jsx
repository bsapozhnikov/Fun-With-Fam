import React from 'react';

class NodeDisplay extends React.Component {
    constructor(props) {
	super(props);
    }
    render() {
	return (<div>
	    {this.props.node ? this.props.node.name : "NODE"}
	    </div>);
    }
}

module.exports = NodeDisplay;
