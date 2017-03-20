import React, { Component } from 'react';
import Results from './Results';
import Spinner from './Spinner';
import MessageBox from './MessageBox';
import Autocomplete from './Autocomplete';
import debounce from 'react-event-debounce'
import './App.css';

const HOST = 'https://api.github.com';
const TOKEN = 'a0bd7e3503b467adbbdd6667c786be689df8b739'; // change

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      reponame: "",
      data: [],
      page: 1,
      perPage: 15,
      lastPage: -1,
      spinner: false,
      errorMessage: '',
      repos: []
    };
  }

  sendRequest(username, reponame, perPage, page) {
    new Promise((resolve, reject) => {
      this.setState({
        ...this.state,
        spinner: true
      });

      let req = HOST + '/repos/' + username + '/' + reponame + '/issues?oauth_token=' + TOKEN + '&per_page=' + perPage + '&page=' + page;

      let xhr = new XMLHttpRequest();
      xhr.open('GET', req, true);
      xhr.send();
      
      xhr.addEventListener('load', () => {
        resolve({
          data: JSON.parse(xhr.response),
          link: xhr.getResponseHeader('Link')
        });

        this.setState({
          ...this.state,
          spinner: false
        });
      });

      xhr.addEventListener('error', () => {
        reject();

        this.setState({
          ...this.state,
          spinner: false
        });
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

      this.setState({
        ...this.state,
        data: res,
        page,
        perPage,
        lastPage,
        errorMessage: res.length === 0 ? 'Данные отсутствуют' : ''
      })
    },

    () => {
      this.setState({
        ...this.state,
        errorMessage: "Во время загрузки данных произошла ошибка"
      });
    });
  }

  sendRepoRequest(input) {
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
    }, () => this.sendRepoRequest(this.state.username));
  }

  changePerPage(perPage) {
    this.sendRequest(this.state.username, this.state.reponame, parseInt(perPage, 10), 1);
  }

  prevPageHandler() {
    this.sendRequest(this.state.username, this.state.reponame, this.state.perPage, this.state.page - 1);
  }

  nextPageHandler() {
    this.sendRequest(this.state.username, this.state.reponame, this.state.perPage, this.state.page + 1);
  }

  firstPageHandler() {
    this.sendRequest(this.state.username, this.state.reponame, this.state.perPage, 1);
  }

  lastPageHandler() {
    this.sendRequest(this.state.username, this.state.reponame, this.state.perPage, this.state.lastPage);
  }

  closeMsgBox() {
    this.setState({
      ...this.state,
      errorMessage: ''
    });
  }

  selectRepoHandler(repo) {
    this.setState({
      ...this.state,
      reponame: repo,
      repos: [],
      page: 1
    }, () => this.sendRequest(this.state.username, repo, this.state.perPage, this.state.page));
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
                          handler={this.selectRepoHandler.bind(this)}
            />
          </div>
        </div>
        <Results data={this.state.data}
                perPage={this.state.perPage}
                currentPage={this.state.page}
                lastPage={this.state.lastPage}
                prevPageHandler={this.prevPageHandler.bind(this)}
                nextPageHandler={this.nextPageHandler.bind(this)}
                firstPageHandler={this.firstPageHandler.bind(this)}
                lastPageHandler={this.lastPageHandler.bind(this)}
                onPerPageChange={this.changePerPage.bind(this)}
        />
        <Spinner visible={this.state.spinner} />
        <MessageBox message={this.state.errorMessage}
                    closeHandler={this.closeMsgBox.bind(this)}
        />
      </div>
    );
  }
}