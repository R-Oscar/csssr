import React from 'react';
import { Link } from 'react-router';
import './styles/Autocomplete.css';

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
			repos,
			owner
		} = this.props;
		return (
			<ul className="autocomplete">
				{repos.map((element, index) =>
					<li key={index} onClick={this.handleChange.bind(this)}>
						<Link to={`/v/${owner}/${element}/1/15/`}>{element}</Link>
					</li>
				)}
			</ul>
		)
	}
}