import React from 'react';
import ReactDOM from 'react-dom';
import {browserHistory} from 'react-router';
import Routes from './route.js';
import './index.css';
import 'whatwg-fetch';
var FastClick = require('fastclick');
FastClick.attach(document.body);
ReactDOM.render(
    <Routes  path="/"/>,
    document.getElementById('root')
);
