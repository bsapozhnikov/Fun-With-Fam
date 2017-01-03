import React from 'react';
import Tree from './Tree';
import AddPersonControl from './AddPersonControl';
import * as d3 from 'd3';

class App extends React.Component {
    constructor(props) {
	super(props);
	this.handleNewPersonSubmit = (person) => { this._handleNewPersonSubmit(person); };
	this.state = {
	    tree: null
	};
    }
    componentDidMount() {
	d3.request("http://localhost:3000/")
	.header("X-Requested-With", "XMLHttpRequest")
	.header("Content-Type", "application/json")
	.get("", (error, rsp) => {
	    if (error) throw error;
	    this.setState({tree: JSON.parse(rsp.response)});
	});		
    }
    _handleNewPersonSubmit(person) {
	person.id = 2;
	const newTree = {
	    nodes: this.state.tree.nodes.concat([person]),
	    links: this.state.tree.links
	}
	console.log(newTree);
	this.setState({tree: newTree});
    }
    render() {
	return (<div>
	    <Tree data={this.state.tree}/>
	    <AddPersonControl handleSubmit={this.handleNewPersonSubmit} />
	    </div>);
    }
}

module.exports = App;
