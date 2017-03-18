import React, { Component } from 'react';
import Results from './Results';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: "facebookincubator/create-react-app",
      showResults: false,
      data: []
    };
  }

  sendRequest(e) {
    // let data = this.state.input.split('/');
    let host = 'https://api.github.com';
    let limit = 100;

    new Promise((resolve, reject) => {
      let req = host + '/repos/' + this.state.input + '/issues?per_page=' + limit + '&page=1';

      let xhr = new XMLHttpRequest();
      xhr.open('GET', req, true);
      xhr.send();
      
      xhr.addEventListener('load', () => {
        resolve(JSON.parse(xhr.response));
      });

      xhr.addEventListener('error', () => {
        reject();
      });
    }).then((response) => {
      console.log(response);
      let res = response.map(element => {
        return {
          'number': element.number,
          'title': element.title,
          'created_at': element.created_at
        }
      });

      this.setState({
        ...this.state,
        showResults: true,
        data: res
      })
    });


  }

  changeInput(e) {
    this.setState({
      ...this.state,
      input: e.target.value
    });
  }

  render() {
    return (
      <div>
        <div className="App-header">
          <h2>Интерфейс Github</h2>
          <input type="text" className="App-search" value={this.state.input} onChange={this.changeInput.bind(this)} />
          <button className="App-button" onClick={this.sendRequest.bind(this)}>OK</button>
        </div>
        <Results visible={this.state.showResults}
                  data={this.state.data}
         />
      </div>
    );
  }
}

export default App;
