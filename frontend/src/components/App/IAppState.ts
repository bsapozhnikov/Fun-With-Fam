import { Node, Tree } from '../../models';

export enum AppMode {
  Default
}

export interface IAppState {
  tree?: Tree;
  displayNode?: Node;
  mode: AppMode;
}
