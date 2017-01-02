import React from 'react';
import Tree from './Tree';
import AddPersonControl from './AddPersonControl';

class App extends React.Component {
    constructor(props) {
	super(props);	
    }    
    render() {
	return (<div>
	    <Tree />
	    <AddPersonControl />
	    </div>);
    }
}

module.exports = App;
