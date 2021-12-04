import React from 'react';
import EditableTextDisplay from '../EditableTextDisplay';
import IPersonDisplayProps from './IPersonDisplayProps';
import IPersonDisplayState from './IPersonDisplayState';

import { locals as styles } from './PersonDisplay.css';

type HtmlAttributes = React.HTMLAttributes<HTMLDivElement>;

export default class extends React.Component<IPersonDisplayProps & HtmlAttributes, IPersonDisplayState> {
  handleAddNewChild: () => void;
  handleAddParent: () => void;
  handleEditName: (name: string) => void;
  handleDelete: () => void;
    constructor(props: IPersonDisplayProps) {
	super(props);
	this.handleAddNewChild = () => this.props.node && this.props.handleAddNewChild(this.props.node);
	this.handleAddParent = () => this.props.node && this.props.handleAddParent(this.props.node);
	this.handleEditName = (newName) => this.props.node && this.props.handleEdit(this.props.node, { name: newName });
	this.handleDelete = () => this.props.node && this.props.handleDelete(this.props.node);
	this.state = { isEditingName: false };
    }
    render() {
      if (this.props.node) {
	return (<div className={this.props.className}>
	  <EditableTextDisplay text={this.props.node.name} handleEdit={this.handleEditName} />
	  <div className={styles.personCtrlBtnGrp}>
	  <div> Add Child </div>
	  <div className={styles.personCtrlSecondaryBtn} onClick={this.handleAddNewChild}>New Person</div>
	  <div className={styles.personCtrlSecondaryBtn} onClick={this.props.handleAddExistingAsChild}>Existing Person</div>
	  </div>
	  <div className={styles.personCtrlBtnGrp} onClick={this.handleAddParent}>Add Parent</div>
	  <div className={styles.personCtrlBtnGrp} onClick={this.handleDelete}>Delete</div>
	  </div>);
      }
      else {
	return (<div className={this.props.className}>Select someone to see their details!</div>);
      }
    }
}
