import React from 'react';
import Tree from './Tree';

class App extends React.Component {
    constructor(props) {
	super(props);	
    }    
    render() {
	return (<div>
	    <Tree />
	    </div>);
    }
}

module.exports = App;
