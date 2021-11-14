import * as d3 from 'd3';

export class Node {
  index: number;
  name: string;
  isRoot: boolean;

  constructor(data: { index: number, name: string, isRoot: boolean }) {
    this.index = data.index as number;
    this.name = data.name;
    this.isRoot = data.isRoot;
  }
};

export class Link {
  source: number;
  target: number;

  constructor(data: { source: number, target: number }) {
    this.source = data.source;
    this.target = data.target;
  }
};

export class Tree {
  nodes: Node[];
  links: Link[];

  constructor() {
    this.nodes = [];
    this.links = [];
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
  isRoot?: boolean;

  constructor(data: Node) {
    this.index = data.index;
    this.isRoot = data.isRoot;
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