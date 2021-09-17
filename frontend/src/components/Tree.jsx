import React from 'react';
import * as d3 from 'd3';

class Tree extends React.Component {
    constructor(props) {
	super(props);
	this.setAge = (n, nodes, parents) => {this._setAge(n, nodes, parents)};
	this.d3setup = (data) => {this._d3setup(data)};
	this.d3update = (data) => {this._d3update(data)};
    }
    _setAge(node, nodesByIndex, parentsByNode) {
        if (node.age !== undefined) { return; }
	node.age = 1;
        parentsByNode[node.index]?.forEach((parentI) => {
	    const parent = nodesByIndex[parentI];
	    this.setAge(parent, nodesByIndex, parentsByNode);
	    node.age = Math.max(node.age, parent.age + 1);
	});
    }
    _d3setup() {
	this.width = 300;
	this.height = 300;
	this.svg = d3.select(this.refs.tree).append('svg')
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
	  .y((n) => (n.age - 1) * 200)
	  .strength(.1));

	this.links = this.svg.append("g")
			 .attr('class', "links");
	this.nodes = this.svg.append("g")
			 .attr('class', "nodes")

	if (this.props.data) {
	    this.d3update()
	}
    }
    _d3update() {
	if (this.props.data) {
	    const parentsByNode = {};
	    const nodesByIndex = {};
	    this.props.data.links.forEach((link) => {
		const targetI = link.target.index ?? link.target;
		if (parentsByNode[targetI] === undefined) {
		    parentsByNode[targetI] = [];
		}
		parentsByNode[targetI].push(link.source.index ?? link.source);
	    });
	    this.props.data.nodes.forEach((n) => {
		n.age = undefined;
	        nodesByIndex[n.index] = n;
		if (n.root) {
		    n.fx = this.width / 2;
		    n.fy = 30;
		}
		else {
		    n.fx = null;
		    n.fy = null;
		}
	    });
	    this.props.data.nodes.forEach((n) => this.setAge(n, nodesByIndex, parentsByNode));

	    var link = this.links.selectAll("line")
	    .data(this.props.data.links);
	    link.exit().remove();
	    var linkEnter = link.enter()
	    .append("line")
	    .attr('stroke', "black");
	    link = linkEnter.merge(link);

	    var node = this.nodes.selectAll(".node")
	    .data(this.props.data.nodes);
	    node.exit().remove();
	    var nodeEnter = node.enter().append("g")
	    .attr('class', "node")
	    .on('click', (d) => this.props.handleNodeClick(d));
	    node = nodeEnter.merge(node);
	    nodeEnter.append("circle")
	    .attr('r', 10)
	    .attr('style', "fill: white; stroke: black");
	    nodeEnter.append("text")
	    .attr('text-anchor', "middle")
	    .attr('alignment-baseline', "middle");
	    node.select("text").text((d) => d.name || "N/A");
	    var ticked = function() {
		link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);
		node.select('text')
		.attr("x", (d) => d.x)
		.attr("y", (d) => d.y);
		node.select('circle')
		.attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y);
            };
	    this.simulation
	    .nodes(this.props.data.nodes)
	    .on('tick', ticked);
	    this.simulation
	    .force('link', d3.forceLink(this.props.data.links).id((d) => d.index).strength(0.1).distance(40));
	    this.simulation.alphaTarget(0.5).restart();
	}
    }
    componentDidMount() {
	this.d3setup();
    }
    componentDidUpdate() {
	this.d3update();
    }
    render() {
	console.log('rendering tree');
	console.log(this.props.data);
	return (<div id="tree" ref="tree"></div>);
    }
}

export default Tree;
