import * as d3 from 'd3';

export class Node {
  index: number;
  name: string;

  constructor(data: { index: number, name: string }) {
    this.index = data.index as number;
    this.name = data.name;
  }
};

export class Link {
  index: number;
  source: number;
  target: number;

  constructor(data: { index: number, source: number, target: number }) {
    this.index = data.index;
    this.source = data.source;
    this.target = data.target;
  }
};

export class Tree {
  nodes: Node[];
  links: Link[];

  constructor(data: { nodes: Node[], links: Link[] }) {
    this.nodes = data.nodes;
    this.links = data.links;
  }
}

export class SimulationPersonDatum implements d3.SimulationNodeDatum {
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  age?: number;

  constructor(data: Node) {
    this.index = data.index;
  }
}

export class SimulationRelationDatum implements d3.SimulationLinkDatum<SimulationPersonDatum> {
  source: number;
  target: number;

  constructor(data: Link) {
    this.source = data.source;
    this.target = data.target;
  }
}

export interface SimulationTreeData {
  nodes: Array<SimulationPersonDatum>;
  links: Array<d3.SimulationLinkDatum<SimulationPersonDatum>>;
}