import React from 'react';
import './Issue.css';
import { HOST, TOKEN } from './config';

export default class Issue extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			link: '',
			date: '',
			title: '',
			userImage: '',
			username: '',
			userURL: '',
			visible: false
		}
	}

	componentDidMount() {
		const {
			username,
			reponame,
			number
		} = this.props.params;

		new Promise((resolve, reject) => {
			let req = `${HOST}/repos/${username}/${reponame}/issues/${number}?oauth_token=${TOKEN}`;

			let xhr = new XMLHttpRequest();
			xhr.open('GET', req, true);
			xhr.send();

			xhr.addEventListener('load', () => resolve(JSON.parse(xhr.response)));
		}).then(response => {
			console.log(response);
			this.setState({
				...this.state,
				link: response.body,
				date: new Date(response.created_at).toLocaleString(),
				title: response.title,
				userImage: response.user.avatar_url,
				username: response.user.login,
				userURL: response.user.html_url,
				visible: true
			})
		});
	}

	render() {
		return (
			<div style={{ 'display': this.state.visible ? 'block' : 'none' }}>
				<div className="issue-header">
					<h1>{this.state.title}</h1>
				</div>
				<div className="issue-wrapper">
					<div className="issue-content">
						<a href={this.state.userURL} target="_blank" className="issue-userinfo">
							<img src={this.state.userImage} alt={this.state.username} className="issue-avatar" />
							{this.state.username}
						</a>
						Дата создания: {this.state.date}
						<br />
						<a href={this.state.link} target="_blank">Перейти на страницу Github</a>
						<br />
						<button className="issue-button">Назад</button>
					</div>
				</div>
			</div>
		)
	}
}