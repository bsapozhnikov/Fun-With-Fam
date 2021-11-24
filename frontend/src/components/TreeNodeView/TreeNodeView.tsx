import React from 'react';
import * as d3 from 'd3';

import { Node, SimulationPersonDatum } from '../../models';

type HtmlAttributes = React.HTMLAttributes<HTMLDivElement>;

class TreeNodeViewProps {
  constructor(
    public simulationData: SimulationPersonDatum,
    public personData: Node,
    public handleClick: (n: Node) => void) {}
}

class TreeNodeViewState {

}

export default class TreeNodeView extends React.Component<TreeNodeViewProps & HtmlAttributes, TreeNodeViewState> {
  render() {
    const name = this.props.personData.name;
    return (
      <g className="node" onClick={() => this.props.handleClick(this.props.personData)}>
      <circle r="10" style={{ fill: "white", stroke: "black" }} />
      <text textAnchor="middle" alignmentBaseline="middle">{name[0] || "?"}</text>
      </g>);
  }
}