import React from 'react';
import TreeView from './TreeView';
import NodeDisplay from './NodeDisplay';
import AddPersonControl from './AddPersonControl';
import * as d3 from 'd3';
import { json } from 'd3-fetch'
import { Node, Link, Tree, SimulationTreeData, SimulationPersonDatum } from '../models';

class AppProps {}

class AppState {
  tree?: Tree;
  displayNode?: Node;
}

class App extends React.Component<AppProps, AppState> {
  saveTree: (tree: Tree) => void;
  updateTree: (nodes: Node[], links: Link[]) => Tree;
  addChild: (parent: Node) => void;
  addParent: (child: Node) => void;
  handleNodeClick: (node: Node) => void;
  handleDeletePerson: (node: Node) => void;
  handleEditPerson: (node: Node, update: Partial<Node>) => void;
  handleNewPersonSubmit: (person: Node) => void;
  constructor(props: AppProps) {
    super(props);
    this.saveTree = (tree) => { this._saveTree(tree); };
    this.updateTree = (nodes, links) => { return this._updateTree(nodes, links); };
    this.addChild = (parent) => { this._addChild(parent); };
    this.addParent = (child) => { this._addParent(child); };
    this.handleNodeClick = (node) => { this._handleNodeClick(node); };
    this.handleDeletePerson = (node) => { this._handleDeletePerson(node); };
    this.handleEditPerson = (node, update: Partial<Node>) => { this._handleEditPerson(node, update); };
    this.handleNewPersonSubmit = (person) => { this._handleNewPersonSubmit(person); };
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

    _saveTree(tree: Tree) {
      json("http://localhost:3000/", {
	method: 'POST',
	body: JSON.stringify(tree),
	headers: {
	  "Content-Type": "application/json",
	  "X-Requested-With": "XMLHttpRequest"
	}
      });
    }
  _updateTree(nodes: Node[], links: Link[]) {
      const newTree = { nodes, links };
	this.setState({tree: newTree});
	return newTree;
    }
    _addChild(parent: Node) {
      if (!this.state.tree) { return; }
      const child = {
	index: this.state.tree.nodes.length,
	name: "",
	isRoot: false
      };
	const link = {
	    source: parent.index,
	    target: child.index
	};
	const newTree = this.updateTree(
	    this.state.tree.nodes.concat([child]),
	    this.state.tree.links
	    //.map((link: Link) => { return { ...link, source: link.source.index, target: link.target.index }; })
	    .concat([link]));
	this.saveTree(newTree);
    }
    _addParent(child: Node) {
      if (!this.state.tree) { return; }
      const parent = new Node({ index: this.state.tree.nodes.length, name:"", isRoot: false });
	const link = {
	    source: parent.index,
	    target: child.index
	};
	const newTree = this.updateTree(
	    this.state.tree.nodes.concat([parent]),
	    this.state.tree.links
	  //.map((link: Link) => { return { ...link, source: link.source.index, target: link.target.index }; })
	    .concat([link]));
	this.saveTree(newTree);
    }
  _handleNodeClick(node: Node) {
    this.setState({displayNode: node});
  }
    _handleDeletePerson(node: Node) {
      if (!this.state.tree) { return; }
      const nodes = this.state.tree.nodes.filter((n: Node) => n !== node);
	const links = this.state.tree.links.filter((link: Link) => link.source !== node.index && link.target !== node.index);
	const newTree = this.updateTree(nodes, links);
	this.saveTree(newTree);
    }
  _handleEditPerson(node: Node, update: Partial<Node>) {
    if (!this.state.tree) { return; }
    const newNode = { ...node, ...update };
    const nodes = this.state.tree.nodes.map((n: Node) => n.index == node.index ? newNode : n);
    const links = this.state.tree.links;
    //.map((link: Link) => { return { ...link, source: link.source, target: link.target }; });XS

    console.log("handleEditPerson", newNode);

    const newTree = this.updateTree(nodes, links);
    if (this.state.displayNode == node) {
      this.setState({displayNode: newNode});
    }

    this.saveTree(newTree);
  }
  _handleNewPersonSubmit(person: Node) {
    if (!this.state.tree) { return; }
      person.index = this.state.tree.nodes.length;
      const newTree = this.updateTree(this.state.tree.nodes.concat([person]), this.state.tree.links);
      this.saveTree(newTree);
    }
    render() {
	return (<div>
	    <TreeView data={this.state.tree as Tree} handleNodeClick={this.handleNodeClick} />
	    <NodeDisplay
	      node={this.state.displayNode}
	      handleAddChild={this.addChild}
	      handleAddParent={this.addParent}
	      handleEdit={this.handleEditPerson}
	      handleDelete={this.handleDeletePerson}
	    />
	    <AddPersonControl handleSubmit={this.handleNewPersonSubmit} />
	    </div>);
    }
}

export default App;
