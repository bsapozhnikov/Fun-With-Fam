import { Node, Tree } from '../../models';

export enum AppMode {
  Default,
  SelectingChild
}

export interface IAppState {
  tree?: Tree;
  displayNode?: Node;
  mode: AppMode;
}
