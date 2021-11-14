import React from 'react';
import memoize from 'memoize-one';
import * as d3 from 'd3';

import {
  Node,
  Link,
  Tree,
  SimulationPersonDatum,
  SimulationRelationDatum,
  SimulationTreeData
} from '../models';

class TreeViewProps {
  constructor(public data: Tree, public handleNodeClick: (node: Node) => void) {}
}

class TreeViewState {

}

export default class TreeView extends React.Component<TreeViewProps, TreeViewState> {
  width = 300;
  height = 300;
  svg: any;
  simulation: any;
  nodes?: any;
  links?: any;
  nodesByIndex: { [index: number]: Node };
  simulationNodesByIndex: { [index: number]: SimulationPersonDatum };
  setAge: (n: SimulationPersonDatum, nodes: { [index: number]: Node }, parents: { [index: number]: number[] }) => void;
  d3setup: () => void;
  d3update: () => void;
  treeToSimulationData: (tree: Tree) => SimulationTreeData;

  constructor(props: TreeViewProps) {
    super(props);
    console.log("TreeView constructor", props);
    this.nodesByIndex = {};
    this.simulationNodesByIndex = {};
    this.setAge = (n, nodes, parents) => {this._setAge(n, nodes, parents)};
    this.d3setup = () => {this._d3setup()};
    this.d3update = () => {this._d3update()};
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
	console.log("toSimulationPersonData 1", curSimNode, node)
	return { ...curSimNode, ...new SimulationPersonDatum(node) };
      }
    };
    return {
      nodes: tree.nodes.map(toSimulationPersonData),
      links: tree.links.map(link => new SimulationRelationDatum(link))
    };
  }
  _setAge(node: SimulationPersonDatum, nodesByIndex: { [index: number]: Node }, parentsByNode: { [index: number]: number[] }) {
    console.log("Setting age for", node, nodesByIndex, parentsByNode)
    if (node.index == undefined) { return; }
    if (node.age !== undefined) { return; }
    node.age = 1;
    parentsByNode[node.index]?.forEach((parentI) => {
      const parent = this.simulationNodesByIndex[parentI];
      this.setAge(parent, nodesByIndex, parentsByNode);
      node.age = Math.max(node.age as number, (parent.age as number) + 1);
    });
  }
    _d3setup() {
      this.svg = d3.select(this.refs.tree as d3.BaseType)
      .append('svg')
		  .attr('width', this.width)
		  .attr('height', this.height);
	this.simulation = d3.forceSimulation()
	.velocityDecay(0.1)
	.force('collide', d3.forceCollide(10))
	.force('charge', d3.forceManyBody().strength(-100))
	.force('X', d3.forceX().x(this.width / 2).strength(0.01))
	.force(
	  'Y',
	  d3.forceY()
	  .y((n: SimulationPersonDatum) => ((n.age ?? 1) - 1) * 200)
	  .strength(.1));

	this.links = this.svg.append("g")
			 .attr('class', "links");
	this.nodes = this.svg.append("g")
			 .attr('class', "nodes")

      this.d3update()
    }
    _d3update() {
      if (!this.props.data) {
	return;
      }

      this.nodesByIndex = {};
      this.props.data.nodes.forEach(n => this.nodesByIndex[n.index] = n);
      const simulationTree = this.treeToSimulationData(this.props.data);

      const parentsByNode: { [index: number]: number[] } = {};
      this.props.data.links.forEach((link) => {
	const targetI = link.target;
	if (parentsByNode[targetI] === undefined) {
	  parentsByNode[targetI] = [];
	}
	parentsByNode[targetI].push(link.source);
      });
      simulationTree.nodes.forEach((n) => n.age = undefined);
      simulationTree.nodes.forEach((n) => this.setAge(n, this.nodesByIndex, parentsByNode));

      var link = this.links?.selectAll("line")
      .data(simulationTree.links);
      link.exit().remove();
      var linkEnter = link.enter()
      .append("line")
      .attr('stroke', "black");
      link = linkEnter.merge(link);

      var node = this.nodes?.selectAll(".node")
      .data(simulationTree.nodes);
      node.exit().remove();
      var nodeEnter = node.enter().append("g")
      .attr('class', "node")
      .on('click', (simNode: SimulationPersonDatum) => {
	if (simNode.index == undefined) { return; }
	return this.props.handleNodeClick(this.nodesByIndex[simNode.index]);
      });
      node = nodeEnter.merge(node);
      nodeEnter.append("circle")
      .attr('r', 10)
      .attr('style', "fill: white; stroke: black");
      nodeEnter.append("text")
      .attr('text-anchor', "middle")
      .attr('alignment-baseline', "middle");
      node.select("text").text((d: SimulationPersonDatum) => {
	if (d.index == undefined) { return "N/A"; }
	return this.nodesByIndex[d.index].name || "N/A";
      });
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
      this.simulation
      .nodes(simulationTree.nodes)
      .on('tick', ticked);
      this.simulation
      .force('link', d3.forceLink(simulationTree.links)
	.id((d) => d.index as number)
	.strength(0.1)
	.distance(40));
      this.simulation.alphaTarget(0.5).restart();
    }
  componentDidMount() {
    console.log("TreeView did mount", this.props.data);
	this.d3setup();
  }
  shouldComponentUpdate(nextProps: any, nextState: any) {
    console.log("TreeView will update", nextProps);
    return true;
  }
  componentDidUpdate() {
    console.log("TreeView did update", this.props.data);
	this.d3update();
    }
    render() {
	console.log('rendering tree', this.props.data);
	return (<div id="tree" ref="tree"></div>);
    }
}