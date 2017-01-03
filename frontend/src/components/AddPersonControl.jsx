import React from 'react';

class AddPersonControl extends React.Component {
    constructor(props) {
	super(props);
	this.handleSubmit = () => { this._handleSubmit(); };
    }
    _handleSubmit() {
	const person = {
	    name: this.refs.name.value
	}
	this.props.handleSubmit(person);
    }
    render() {
	return (<div>
	    <input type="text" ref="name" placeholder="Name"/>
	    <button onClick={this.handleSubmit}>Submit</button>
	    </div>);
    }
}

module.exports = AddPersonControl;
