import React from 'react';
import IAppState from './IAppState';
import { Node, Link, Tree } from '../../models';

export default interface IApp {
    saveTree: (tree: Tree) => void;
    updateTree: (nodes: Node[], links: Link[]) => Tree;
    addNewChild: (parent: Node) => void;
    addParent: (child: Node) => void;
    handleNodeClick: (node: Node) => void;
    handleDeletePerson: (node: Node) => void;
    handleEditPerson: (node: Node, update: Partial<Node>) => void;
    handleNewPersonSubmit: (person: Node) => void;
}
