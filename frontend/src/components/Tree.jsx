import React from 'react';
import * as d3 from 'd3';

class Tree extends React.Component {
    constructor(props) {
	super(props);
    }
    d3setup(data){
	const width = 300;
	const height = 300;
	const svg = d3.select(this.refs.tree).append('svg')
		  .attr('width', width)
		  .attr('height', height);
	var link = svg.append("g")
		.attr("class", "links")
		.selectAll("line")
		.data(data.links)
		.enter()
		.append("line")
		.attr("stroke", "black");
        var node = svg.append("g")
		.attr("class", "nodes")
		.selectAll(".node")
		.data(data.nodes)
		.enter().append("g")
		.attr("class", "node");
	var circle = node.append("circle")
		.attr("r", 10)
		.attr("style", "fill: white; stroke: black");
	var text = node.append("text")
		.text("test");
	var ticked = function() {
            link.attr("x1", (d) => d.source.x)
                .attr("y1", (d) => d.source.y)
                .attr("x2", (d) => d.target.x)
                .attr("y2", (d) => d.target.y);
	    text.attr("x", (d) => d.x)
		.attr("y", (d) => d.y);
            circle.attr("cx", (d) => d.x)
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
    componentDidMount() {
	d3.request("http://localhost:3000/")
	.header("X-Requested-With", "XMLHttpRequest")
	.header("Content-Type", "application/json")
	.get("", (error, rsp) => {
	    if (error) throw error;
	    this.d3setup(JSON.parse(rsp.response));
 	    console.log(JSON.parse(rsp.response));
	});
	
    }
    render() {
	return (<div id="tree" ref="tree"></div>);
    }
}

module.exports = Tree;
