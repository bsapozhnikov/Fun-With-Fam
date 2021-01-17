import React from 'react';
import Tree from './Tree';
import NodeDisplay from './NodeDisplay';
import AddPersonControl from './AddPersonControl';
import * as d3 from 'd3';

class App extends React.Component {
    constructor(props) {
	super(props);
	this.saveNode = (node) => { this._saveNode(node); };
	this.updateTree = (nodes, links) => { this._updateTree(nodes, links); };
	this.addChild = (parent) => { this._addChild(parent); };
	this.handleNodeClick = (node) => { this._handleNodeClick(node); };
	this.handleDeletePerson = (node) => { this._handleDeletePerson(node); };
	this.handleNewPersonSubmit = (person) => { this._handleNewPersonSubmit(person); };
	this.state = {
	    tree: null,
	    displayNode: null
	};
    }
    componentDidMount() {
	d3.request("http://localhost:3000/")
	.header("X-Requested-With", "XMLHttpRequest")
	.header("Content-Type", "application/json")
	.get("", (error, rsp) => {
	    if (error) throw error;
	    this.setState({tree: JSON.parse(rsp.responseText)});
	});
    }
    _saveNode(node) {
	d3.request("http://localhost:3000/")
	.header("X-Requested-With", "XMLHttpRequest")
	.header("Content-Type", "application/json")
	.post(JSON.stringify(node),(error, rsp) => {
	    if (error) throw error;
	})
    }
    _updateTree(nodes, links) {
	const newTree = {
	    nodes,
	    links
	}
	this.setState({tree: newTree});
    }
    _addChild(parent) {
	const child = {
	    id: 2,
	    name: ''
	};
	const link = {
	    source: parent.id,
	    target: child.id
	};
	this.updateTree(this.state.tree.nodes.concat([child]),
	    this.state.tree.links.concat([link]));
	this.saveNode(child);
    }
    _handleNodeClick(node) {
	this.setState({displayNode: node});
    }
    _handleDeletePerson(node) {
	const nodes = this.state.tree.nodes.filter((n) => n !== node);
	const links = this.state.tree.links.filter((link) => link.source !== node && link.target !== node);
	this.updateTree(nodes, links);	
    }
    _handleNewPersonSubmit(person) {
	person.id = 2;
	this.updateTree(this.state.tree.nodes.concat([person]), this.state.tree.links);
    }
    render() {
	return (<div>
	    <Tree data={this.state.tree} handleNodeClick={this.handleNodeClick} />
	    <NodeDisplay 
	      node={this.state.displayNode}
	      handleAddChild={this.addChild} 
	      handleDelete={this.handleDeletePerson}
	    />
	    <AddPersonControl handleSubmit={this.handleNewPersonSubmit} />
	    </div>);
    }
}

module.exports = App;
