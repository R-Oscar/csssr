import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './Results.css';

export default class Results extends React.Component {
	static propTypes = {
		data: React.PropTypes.array.isRequired,
		perPage: React.PropTypes.number.isRequired,
		currentPage: React.PropTypes.number.isRequired,
		lastPage: React.PropTypes.number.isRequired,
		username: React.PropTypes.string.isRequired,
		reponame: React.PropTypes.string.isRequired,
		prevPageHandler: React.PropTypes.func.isRequired,
		nextPageHandler: React.PropTypes.func.isRequired,
		firstPageHandler: React.PropTypes.func.isRequired,
		lastPageHandler: React.PropTypes.func.isRequired,
		onPerPageChange: React.PropTypes.func.isRequired
	}

	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.props.onPerPageChange(e.target.value);
	}

	render() {
		console.log(this.props.data);
		const {
			data,
			perPage,
			currentPage,
			lastPage,
			username,
			reponame,
			prevPageHandler,
			nextPageHandler,
			firstPageHandler,
			lastPageHandler
		} = this.props;

		return (
			<Router>
				<div className="results-wrapper" style={{ 'display': data.length > 0 ? 'table' : 'none' }}>
					<h1>{username}/{reponame}</h1>
					<select value={perPage} onChange={this.handleChange}>
						<option value="15">15</option>
						<option value="30">30</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</select>

					<p className="results-status">Отображается стр. {currentPage} из {lastPage}</p>

					<table className="results">
						<thead>
							<tr>
								<th>№</th>
								<th>Название</th>
								<th>Дата открытия</th>
							</tr>
						</thead>
						<tbody>
							{data.map(element => {
								return <tr key={element.number}>
										<td>{element.number}</td>
										<td>
											<Link to={`/v/${username}/${reponame}/${element.number}`}>{element.title}</Link>
										</td>
										<td>{new Date(element.created_at).toLocaleString()}</td>
									</tr>
							})}
						</tbody>
					</table>

					<div className="pagination">
						<button disabled={currentPage === 1}
								onClick={firstPageHandler.bind(this)}
						>&lt;&lt;</button>
						<button disabled={currentPage === 1}
								onClick={prevPageHandler.bind(this)}
						>&lt;</button>
						<button disabled={currentPage === lastPage}
								onClick={nextPageHandler.bind(this)}
						>&gt;</button>
						<button disabled={currentPage === lastPage}
								onClick={lastPageHandler.bind(this)}
						>&gt;&gt;</button>
					</div>
				</div>
			</Router>
		)
	}
}