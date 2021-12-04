import * as d3 from 'd3';
import ITreeViewProps from './ITreeViewProps';
import memoize from 'memoize-one';
import React from 'react';
import TreeNodeView from '../TreeNodeView/TreeNodeView';
import TreeLinkView from '../TreeLinkView/TreeLinkView';

import { locals as styles} from './TreeView.css';

import {
  Node,
  Link,
  Tree,
  SimulationPersonDatum,
  SimulationRelationDatum,
  SimulationTreeData
} from '../../models';

type HtmlAttributes = React.HTMLAttributes<HTMLDivElement>;

export default class TreeView extends React.Component<ITreeViewProps & HtmlAttributes, {}> {
  svg: any;
  simulation: any;
  nodes?: any;
  links?: any;
  nodesByIndex: { [index: number]: Node };
  simulationNodesByIndex: { [index: number]: SimulationPersonDatum };
  simulationLinksByIndex: { [index: number]: SimulationRelationDatum };
  setAge: (
    n: SimulationPersonDatum,
    children: { [index: number]: number[] },
    parents: { [index: number]: number[] }) => { minAge: number, maxAge: number };
  d3setup: () => void;
  treeToSimulationData: (tree: Tree) => SimulationTreeData;

  constructor(props: ITreeViewProps) {
    super(props);
    console.log("TreeView constructor", props);
    this.nodesByIndex = {};
    this.simulationNodesByIndex = {};
    this.simulationLinksByIndex = {};
    this.setAge = (n, children, parents) => { return this._setAge(n, children, parents); };
    this.d3setup = () => {this._d3setup()};
    this.treeToSimulationData = memoize(this._treeToSimulationData);
  }
  _treeToSimulationData(tree: Tree) {
    let toSimulationPersonData = (node: Node) => {
      if (!(node.index in this.simulationNodesByIndex)) {
	const simNode = new SimulationPersonDatum(node);
	this.simulationNodesByIndex[node.index] = simNode;
	return simNode;
      }
      else {
	const curSimNode = this.simulationNodesByIndex[node.index];
	const nextSimNode = { ...curSimNode, ...new SimulationPersonDatum(node) };
	this.simulationNodesByIndex[node.index] = nextSimNode;
	return nextSimNode;
      }
    };
    let toSimulationRelationData = (link: Link) => {
      if (!(link.index in this.simulationLinksByIndex)) {
	const simLink = new SimulationRelationDatum(link);
	this.simulationLinksByIndex[link.index] = simLink;
	return simLink;
      }
      else {
	const curSimLink = this.simulationLinksByIndex[link.index];
	const nextSimLink = { ...curSimLink, ...new SimulationRelationDatum(link) };
	this.simulationLinksByIndex[link.index] = nextSimLink;
	console.log("toSimulationRelationData 1", curSimLink, link)
	return nextSimLink;
      }
    }
    return {
      nodes: tree.nodes.map(toSimulationPersonData),
      links: tree.links.map(toSimulationRelationData)
    };
  }
  _setAge(
    node: SimulationPersonDatum,
    childrenByNode: { [index:number]: number[] },
    parentsByNode: { [index: number]: number[] }) {
      if (node.index == undefined) { return { minAge: 0, maxAge: 0 }; }
      if (node.age == undefined) { return { minAge: 0, maxAge: 0 }; }

      let minAge = node.age;
      let maxAge = node.age;

      childrenByNode[node.index]?.forEach((childI) => {
	if (!(childI in this.simulationNodesByIndex )) { return; }
	const child = this.simulationNodesByIndex[childI];
	if (child.age !== undefined) { return; }
	child.age = (node.age ?? 0) + 1;
	const { minAge: innerMinAge, maxAge: innerMaxAge } = this.setAge(child, childrenByNode, parentsByNode);
	minAge = Math.min(minAge, innerMinAge);
	maxAge = Math.max(maxAge, innerMaxAge);
      });

      parentsByNode[node.index]?.forEach((parentI) => {
	if (!(parentI in this.simulationNodesByIndex )) { return; }
	const parent = this.simulationNodesByIndex[parentI];
	if (parent.age !== undefined) { return; }
	parent.age = (node.age ?? 0) - 1;
	const { minAge: innerMinAge, maxAge: innerMaxAge } = this.setAge(parent, childrenByNode, parentsByNode);
	minAge = Math.min(minAge, innerMinAge);
	maxAge = Math.max(maxAge, innerMaxAge);
      });

      return { minAge, maxAge };
    }
  _d3setup() {
    const treeElement = this.refs.tree as d3.BaseType & HTMLElement;
    const svgElement = this.refs.svg as d3.BaseType & HTMLElement;
    const nodesElement = this.refs.nodes as d3.BaseType;
    const linksElement = this.refs.links as d3.BaseType;
    this.svg = d3.select(svgElement);
    this.simulation = d3.forceSimulation()
    .velocityDecay(0.1)
    .force('collide', d3.forceCollide(10))
    .force('charge', d3.forceManyBody().strength(-80))
    .force('X', d3.forceX().x(() => treeElement.offsetWidth / 2).strength(0.01))
    .force(
      'Y',
      d3.forceY()
      .y((n: SimulationPersonDatum) => ((n.age ?? 1) - 1) * 100 + 50)
      .strength(.1));

    this.nodes = d3.select(nodesElement);
    this.links = d3.select(linksElement);
  }
  componentDidMount() {
    console.log("TreeView did mount", this.props.data);
    this.d3setup();
  }
  render() {
    console.log('rendering tree', this.props.data);
    var simulationTree: SimulationTreeData = { nodes: [], links: [] };
    var nodeViews: JSX.Element[] = [];
    var linkViews: JSX.Element[] = [];
    if (this.props.data) {
      this.props.data.nodes.forEach(n => this.nodesByIndex[n.index] = n);
      simulationTree = this.treeToSimulationData(this.props.data);
      nodeViews = this.props.data.nodes.map((personNode) =>
	<TreeNodeView
	key={personNode.index}
	simulationData={this.simulationNodesByIndex[personNode.index]}
	personData={personNode}
	handleClick={this.props.handleNodeClick}
	/>);
      linkViews = this.props.data.links.map((relationLink) =>
	<TreeLinkView
	key={relationLink.index}
	/>);
    }

    return (
      <div id="tree" ref="tree" className={this.props.className}>
      <svg ref="svg" className={styles.treeCanvas}>
      <g ref="links" className="links">{linkViews}</g>
      <g ref="nodes" className="nodes">{nodeViews}</g>
      </svg>
      </div>);
  }
  componentDidUpdate() {
    const simulationTree = this.treeToSimulationData(this.props.data);

    const childrenByNode: { [index:number]: number[] } = {};
      const parentsByNode: { [index: number]: number[] } = {};
      this.props.data.links.forEach((link) => {
	const parentI = link.source;
	const childI = link.target;
	if (parentsByNode[childI] === undefined) {
	  parentsByNode[childI] = [];
	}
	parentsByNode[childI].push(parentI);

	if (childrenByNode[parentI] === undefined) {
	  childrenByNode[parentI] = [];
	}
	childrenByNode[parentI].push(childI);
      });

      if (simulationTree.nodes.length > 0) {
	simulationTree.nodes.forEach(n => n.age = undefined);
	const n = simulationTree.nodes[0];
	n.age = 0;
	const { minAge, maxAge } = this.setAge(
	  simulationTree.nodes[0],
	  childrenByNode,
	  parentsByNode);
	simulationTree.nodes.forEach(n => {
	  if (n.age !== undefined) {
	    n.age += 1 - minAge;
	  }
	});
      }

    var node = this.nodes?.selectAll(".node").data(simulationTree.nodes);
    var link = this.links?.selectAll("line").data(simulationTree.links);

    var ticked = function() {
      link.attr("x1", (d: SimulationRelationDatum) => (d.source as SimulationPersonDatum).x)
      .attr("y1", (d: SimulationRelationDatum) => (d.source as SimulationPersonDatum).y)
      .attr("x2", (d: SimulationRelationDatum) => (d.target as SimulationPersonDatum).x)
      .attr("y2", (d: SimulationRelationDatum) => (d.target as SimulationPersonDatum).y);
      node.select('text')
      .attr("x", (d: SimulationPersonDatum) => d.x)
      .attr("y", (d: SimulationPersonDatum) => d.y);
      node.select('circle')
      .attr("cx", (d: SimulationPersonDatum) => d.x)
      .attr("cy", (d: SimulationPersonDatum) => d.y);
    };
    this.simulation.nodes(simulationTree.nodes).on('tick', ticked);

    this.simulation
    .force('link', d3.forceLink(simulationTree.links)
      .id((d) => d.index as number)
      .strength(0.01)
      .distance(10));
    this.simulation.alphaTarget(0.5).restart();
  }
}
