import ITreeNodeViewProps from './ITreeNodeViewProps';
import React from 'react';
import * as d3 from 'd3';

import { Node, SimulationPersonDatum } from '../../models';

type HtmlAttributes = React.HTMLAttributes<HTMLDivElement>;

export default class TreeNodeView extends React.Component<ITreeNodeViewProps & HtmlAttributes, {}> {
  render() {
    const name = this.props.personData.name;
    return (
      <g className="node" onClick={() => this.props.handleClick(this.props.personData)}>
      <circle r="10" style={{ fill: "white", stroke: "black" }} />
      <text textAnchor="middle" alignmentBaseline="middle">{name[0] || "?"}</text>
      </g>);
  }
}