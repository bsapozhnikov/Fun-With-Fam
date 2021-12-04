import * as d3 from 'd3';
import React from 'react';
import TreeView from '../TreeView/TreeView';
import PersonDisplay from '../PersonDisplay/PersonDisplay';
import AddPersonControl from '../AddPersonControl';

import { locals as styles } from './App.css';
import { IAppState, AppMode } from './IAppState';

import { json } from 'd3-fetch'
import { Node, Link, Tree, SimulationTreeData, SimulationPersonDatum } from '../../models';

class App extends React.Component<{}, IAppState> {
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
        displayNode: undefined,
        mode: AppMode.Default
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
    const child = this.createNewPerson();
    const link = this.createNewRelationship({ parent, child });
    this.addToTree([child], [link]);
  }
  addParent(child: Node) {
    if (!this.state.tree) { return; }
    const parent = this.createNewPerson();
    const link = this.createNewRelationship({ parent, child });
    this.addToTree([parent], [link]);
  }
  createNewPerson(): Node {
    const nodes = this.state.tree?.nodes ?? [];
    return new Node({ index: nodes.length, name: "" });
  }
  createNewRelationship(data: { parent: Node, child: Node }): Link {
    const links = this.state.tree?.links ?? [];
    return new Link({
      index: links.length,
      source: data.parent.index,
      target: data.child.index
    });
  }
  addToTree(newNodes: Node[], newLinks: Link[]) {
    if (!this.state.tree) { return; }
    const newTree = this.updateTree(
      this.state.tree.nodes.concat(newNodes),
      this.state.tree.links.concat(newLinks));
    this.saveTree(newTree);
  }
  handleNodeClick(node: Node) {
    switch (this.state.mode) {
      case AppMode.SelectingChild:
        if (!this.state.displayNode) { console.log("No parent node selected"); break; }
        const link = this.createNewRelationship({ parent: this.state.displayNode, child: node });
        this.addToTree([], [link]);
        this.setState({ mode: AppMode.Default });
        break;
      default:
        this.setState({displayNode: node});
    }
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
        handleAddExistingAsChild={() => this.setState({ mode: AppMode.SelectingChild})}
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
