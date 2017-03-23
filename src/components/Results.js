import React from 'react';
import { Link, browserHistory } from 'react-router';
import MessageBox from './MessageBox';
import Spinner from './Spinner';
import { HOST, TOKEN } from './config';
import './styles/Results.css';

export default class Results extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			lastPage: -1,
			errorMessage: '',
			spinner: false
		}
	}

	sendRequest(username, reponame, page, perPage) {
	  new Promise((resolve, reject) => {
	  	this.setState({
	  	  ...this.state,
	  	  spinner: true
	  	});

	    let req = `${HOST}/repos/${username}/${reponame}/issues?oauth_token=${TOKEN}&per_page=${perPage}&page=${page}`;

	    let xhr = new XMLHttpRequest();
	    xhr.open('GET', req, true);
	    xhr.send();
	    
	    xhr.addEventListener('load', () => {
	      resolve({
	        data: JSON.parse(xhr.response),
	        link: xhr.getResponseHeader('Link')
	      });
	    });

	    xhr.addEventListener('error', () => {
	      reject();
	    });
	  }).then(response => {
	    let lastPage = null;

	    if (response.link !== null) {
	      for (let element of response.link.split(',')) {
	        if (element.indexOf('last') !== -1) {
	          lastPage = +element.substring(element.indexOf('&page=') + 6, element.indexOf('>'));
	        }
	      }
	    }

	    lastPage = lastPage === null ? page : lastPage;

	    let res = response.data.map(element => {
	      return {
	        'number': element.number,
	        'title': element.title,
	        'created_at': element.created_at
	      }
	    });

	    if (res.length > 0) {
		    this.setState({
		      ...this.state,
		      data: res,
		      lastPage,
		      spinner: false
		    });
		} else {
			this.setState({
				...this.state,
				data: [],
				lastPage: -1,
				errorMessage: "Данные отсутствуют",
				spinner: false
			})
		}
	  },

	  // reject()
	  () => {
	    this.setState({
	      ...this.state,
	      errorMessage: "Во время загрузки данных произошла ошибка",
	      spinner: false
	    });
	  });
	}

	componentDidMount() {
		const {
			username,
			reponame,
			page,
			perPage
		} = this.props.params;
		this.sendRequest(username, reponame, page, perPage);
	}

	componentDidUpdate(prevProps) {
		const {
			username,
			reponame,
			page,
			perPage
		} = this.props.params;

		if (this.props.params !== prevProps.params) {
			this.sendRequest(username, reponame, page, perPage);
		}
	}

	handleChange(e) {
		const {
			username,
			reponame
		} = this.props.params;
		browserHistory.push(`/v/${username}/${reponame}/1/${e.target.value}`);
		this.sendRequest(username, reponame, 1, e.target.value);
	}

	prevPageHandler() {
		let params = this.props.params;
		browserHistory.push(`/v/${params.username}/${params.reponame}/${+params.page - 1}/${params.perPage}`);
	}

	nextPageHandler() {
		let params = this.props.params;
		browserHistory.push(`/v/${params.username}/${params.reponame}/${+params.page + 1}/${params.perPage}`);
	}

	firstPageHandler() {
		let params = this.props.params;
		browserHistory.push(`/v/${params.username}/${params.reponame}/1/${params.perPage}`);
	}

	lastPageHandler() {
		let params = this.props.params;
		browserHistory.push(`/v/${params.username}/${params.reponame}/${this.state.lastPage}/${params.perPage}`);
	}

	closeMsgBox() {
		this.setState({
			...this.state,
			errorMessage: ''
		});
	}

	render() {
		const {
			data,
			lastPage
		} = this.state;

		const {
			username,
			reponame,
			page,
			perPage
		} = this.props.params;

		return (
			<div>
				<div className="results-wrapper" style={{ 'display': data.length > 0 ? 'table' : 'none' }}>
					<h1>{username}/{reponame}</h1>
					<select value={perPage} onChange={this.handleChange.bind(this)}>
						<option value="15">15</option>
						<option value="30">30</option>
						<option value="50">50</option>
						<option value="100">100</option>
					</select>

					<p className="results-status">Отображается стр. {page} из {lastPage}</p>

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
						<button disabled={+page === 1}
								onClick={this.firstPageHandler.bind(this)}
						>&lt;&lt;</button>
						<button disabled={+page === 1}
								onClick={this.prevPageHandler.bind(this)}
						>&lt;</button>
						<button disabled={+page === +lastPage}
								onClick={this.nextPageHandler.bind(this)}
						>&gt;</button>
						<button disabled={+page === +lastPage}
								onClick={this.lastPageHandler.bind(this)}
						>&gt;&gt;</button>
					</div>
				</div>
				<MessageBox message={this.state.errorMessage}
				            closeHandler={this.closeMsgBox.bind(this)}
				/>
				<Spinner visible={this.state.spinner} />
			</div>
		)
	}
}