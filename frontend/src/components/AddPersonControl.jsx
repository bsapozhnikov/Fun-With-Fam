import React from 'react';

class AddPersonControl extends React.Component {
    constructor(props) {
	super(props);	
    }
    handleSubmit() {
	console.log("adding person");
    }
    render() {
	return (<div>
	    <input type="text" ref="name" placeholder="Name"/>
	    <button onClick={this.handleSubmit}>Submit</button>
	    </div>);
    }
}

module.exports = AddPersonControl;
