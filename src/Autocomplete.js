import React from 'react';
import './Autocomplete.css';

export default class Autocomplete extends React.Component {
	static propTypes = {
		repos: React.PropTypes.array,
		handler: React.PropTypes.func
	}

	handleChange(e) {
		this.props.handler(e.target.textContent)
	}

	render() {
		const {
			repos
		} = this.props;
		return (
			<ul className="autocomplete">
				{repos.map((element, index) =>
					<li key={index} onClick={this.handleChange.bind(this)}>{element}</li>
				)}
			</ul>
		)
	}
}