import React from 'react';
import * as d3 from 'd3';

class Tree extends React.Component {
    constructor(props) {
	super(props);
    }
    tick() {
	const vis = d3.select(this.refs.tree).selectAll('.d3-points');
	vis.selectAll('.link').attr("x1", function(d) { return d.source.x; })
	    .attr("y1", function(d) { return d.source.y; })
	    .attr("x2", function(d) { return d.target.x; })
	    .attr("y2", function(d) { return d.target.y; });
	vis.selectAll('.node').attr("cx", function(d) { return d.x; })
	    .attr("cy", function(d) { return d.y; });
    }
    componentDidMount() {
	const width = 300;
	const height = 300;
	const data = {nodes: [{id: 0},{id: 1}], links: [{source: 0, target: 1}]};
	const svg = d3.select(this.refs.tree).append('svg')
		  .attr('width', width)
		  .attr('height', height);
	svg.append('g').attr('class', 'd3-points');
	var link = svg.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(data.links)
		.enter()
		.append("line")
		.attr("stroke", "black");
        var node = svg.append("g")
		.attr("class", "nodes")
		.selectAll("circle")
		.data(data.nodes)
		.enter().append("circle")
		.attr("r", 10);
	var ticked = function() {
            link
                .attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);
	    
            node
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y);
        };
	const simulation = d3.forceSimulation()
		  .force("link", d3.forceLink().id((d) => d.index))
		  .force("charge", d3.forceManyBody().strength(-200))
		  .force("center", d3.forceCenter(width / 2, height / 2))
		  .nodes(data.nodes)
		  .on('tick', ticked);
	simulation.force('link').links(data.links);
	
    }
    render() {
	return (<div id="tree" ref="tree"></div>);
    }
}

module.exports = Tree;
