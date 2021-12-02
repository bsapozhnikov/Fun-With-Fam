import * as d3 from 'd3';
import React from 'react';
import IApp from './IApp';
import IAppState from './IAppState';
import TreeView from '../TreeView/TreeView';
import PersonDisplay from '../PersonDisplay/PersonDisplay';
import AddPersonControl from '../AddPersonControl';

import { locals as styles } from './App.css';

import { json } from 'd3-fetch'
import { Node, Link, Tree, SimulationTreeData, SimulationPersonDatum } from '../../models';

class App extends React.Component<{}, IAppState> implements IApp {
    constructor(props: {}) {
	super(props);
	this.saveTree = this.saveTree.bind(this);
	this.updateTree = this.updateTree.bind(this);
	this.addNewChild = this.addNewChild.bind(this);
	this.addParent = this.addParent.bind(this);
	this.handleNodeClick = this.handleNodeClick.bind(this);
	this.handleDeletePerson = this.handleDeletePerson.bind(this);
	this.handleEditPerson = this.handleEditPerson.bind(this);
	this.handleNewPersonSubmit = this.handleNewPersonSubmit.bind(this);
    this.state = {
      tree: undefined,
      displayNode: undefined
    };
  }
  componentDidMount() {
    json("http://localhost:3000/")
      .then((data) => {
	const treeData = data as Tree;
	console.log("App got data", data);
	this.setState({ tree: treeData });
      });
    }

    saveTree(tree: Tree) {
      json("http://localhost:3000/", {
	method: 'POST',
	body: JSON.stringify(tree),
	headers: {
	  "Content-Type": "application/json",
	  "X-Requested-With": "XMLHttpRequest"
	}
      });
    }
    updateTree(nodes: Node[], links: Link[]) {
	const newTree = new Tree({ nodes, links });
	this.setState({ tree: newTree });
	return newTree;
    }
    addNewChild(parent: Node) {
	if (!this.state.tree) { return; }
	const child = new Node({
	    index: this.state.tree.nodes.length,
	    name: ""
	});
	const link = {
	    index: this.state.tree.links.length,
	    source: parent.index,
	    target: child.index
	};
	const newTree = this.updateTree(
	    this.state.tree.nodes.concat([child]),
	    this.state.tree.links.concat([link]));
	this.saveTree(newTree);
    }
    addParent(child: Node) {
    if (!this.state.tree) { return; }
    const parent = new Node({ index: this.state.tree.nodes.length, name:"" });
    const link = new Link({
      index: this.state.tree.links.length,
      source: parent.index,
      target: child.index
    });
    const newTree = this.updateTree(
      this.state.tree.nodes.concat([parent]),
      this.state.tree.links.concat([link]));
    this.saveTree(newTree);
  }
    handleNodeClick(node: Node) {
    this.setState({displayNode: node});
  }
    handleDeletePerson(node: Node) {
      if (!this.state.tree) { return; }
      const nodes = this.state.tree.nodes.filter((n: Node) => n !== node);
	const links = this.state.tree.links.filter((link: Link) => link.source !== node.index && link.target !== node.index);
	const newTree = this.updateTree(nodes, links);
	this.saveTree(newTree);
    }
    handleEditPerson(node: Node, update: Partial<Node>) {
    if (!this.state.tree) { return; }
    const newNode = { ...node, ...update };
    const nodes = this.state.tree.nodes.map((n: Node) => n.index == node.index ? newNode : n);
    const links = this.state.tree.links;

    console.log("handleEditPerson", newNode);

    const newTree = this.updateTree(nodes, links);
    if (this.state.displayNode == node) {
      this.setState({displayNode: newNode});
    }

    this.saveTree(newTree);
  }
    handleNewPersonSubmit(person: Node) {
    if (!this.state.tree) { return; }
      person.index = this.state.tree.nodes.length;
      const newTree = this.updateTree(this.state.tree.nodes.concat([person]), this.state.tree.links);
      this.saveTree(newTree);
    }
  render() {
      return (
	<div>
	<TreeView
	data={this.state.tree as Tree}
	handleNodeClick={this.handleNodeClick}
	className={styles.treeView}
	/>
	<PersonDisplay
	node={this.state.displayNode}
	handleAddNewChild={this.addNewChild}
	handleAddParent={this.addParent}
	handleEdit={this.handleEditPerson}
	handleDelete={this.handleDeletePerson}
	className={styles.personView}
	/>
	{/* <AddPersonControl handleSubmit={this.handleNewPersonSubmit} /> */}
	</div>);
    }
}

export default App;
