import React from 'react';
import './Spinner.css';

const Spinner = ({ visible }) =>
	<div className="overlay" style={{ 'display': visible ? 'block' : 'none' }}>
		<div className="loader"></div>
	</div>

Spinner.propTypes = {
	visible: React.PropTypes.bool
}

export default Spinner;