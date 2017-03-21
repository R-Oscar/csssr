import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Issue from './Issue';
import { Router, Route, browserHistory } from 'react-router';
import './index.css';

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App} />
		<Route path="/v/:username/:reponame/:number" component={Issue} />
	</Router>,
	document.getElementById('root')
);
