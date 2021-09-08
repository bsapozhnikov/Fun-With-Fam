import React from 'react';

class EditableTextDisplay extends React.Component {
    constructor(props) {
	super(props);
	this.handleEdit = (e) => this.props.handleEdit(e.target.value);
	this.state = { isEditingText: false };
    }
    render() {
    	if (this.state.isEditingText) {
	    return (<div>
	        <input type="text" value={this.props.text} onChange={this.handleEdit}></input>
		</div>);
	}
	else {
	    return (<div onClick={() => this.setState({isEditingText: true})}> {this.props.text || "N/A"} </div>)
	}
    }
}

export default EditableTextDisplay;