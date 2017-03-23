import React from 'react';
import Autocomplete from './Autocomplete';
import debounce from 'react-event-debounce';
import { HOST, TOKEN } from './config';
import './styles/App.css';

export default class MainLayout extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: "",
			errorMessage: '',
			repos: []
		};
	}

	getRepos(input) {
	  new Promise((resolve, reject) => {
	    let req = HOST + '/users/' + input + '/repos?oauth_token=' + TOKEN;

	    let xhr = new XMLHttpRequest();
	    xhr.open('GET', req, true);
	    xhr.send();

	    xhr.addEventListener('load', () => {
	      if (xhr.status === 200) {
	        resolve(JSON.parse(xhr.response));
	      } else if (xhr.status === 404) {
	        this.setState({
	          ...this.state,
	          repos: []
	        })
	      }
	    });
	  }).then(response => {
	    let repos = response.map(element => element.name);
	    this.setState({
	      ...this.state,
	      repos
	    });
	  });
	}

	changeUsername(e) {
	  this.setState({
	    ...this.state,
	    username: e.target.value
	  }, () => this.getRepos(this.state.username));
	}

	selectRepoHandler(repo) {
	  this.setState({
	    ...this.state,
	    repos: []
	  });
	}

	render() {
	  return (
	    <div className="App-container">
	      <div className="App-header">
	        <h2>Интерфейс Github</h2>
	        <div className="App-search-wrapper">
	          <input type="text" placeholder="Enter username..." className="App-search" value={this.state.input} onChange={debounce(this.changeUsername.bind(this), 300)}
	              onFocus={this.changeUsername.bind(this)} />
	          <Autocomplete repos={this.state.repos}
	          				owner={this.state.username}
	                        handler={this.selectRepoHandler.bind(this)}
	          />
	        </div>
	      </div>
	      {this.props.children}
	    </div>
	  );
	}
}