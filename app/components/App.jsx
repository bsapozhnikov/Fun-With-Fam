var React = require('react');
var Tree = require('./Tree');

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
