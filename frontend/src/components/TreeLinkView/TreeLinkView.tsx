import * as d3 from 'd3';
import ITreeLinkViewProps from './ITreeLinkViewProps';
import React from 'react';

type HtmlAttributes = React.HTMLAttributes<HTMLDivElement>;

export default class TreeNodeView extends React.Component<ITreeLinkViewProps & HtmlAttributes, {}> {
  render() {
    return (
      <g><line stroke="black"/></g>);
  }
}