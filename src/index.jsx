import * as $ from "jquery";
import Post from "./models/Post";
import "./babel";
import "./styles/index.css";
import "./styles/less.less";
import "./styles/scss.scss";
import json from "./assets/json.json";
import WebpackLogo from './assets/webpack-logo.png';
import xml from "./assets/data.xml";
import csv from "./assets/data.csv";
import React from 'react'
import {render} from 'react-dom'

const App = () => (
    <div className="container">
        <h1>Webpack Course</h1>
        <hr />
        <div className="logo" />
        <hr />
        <pre />
        <hr />
        <div className="box">
            <h2>Less</h2>
        </div>

        <div className="card">
            <h2>SCSS</h2>
        </div>
    </div>
)

render(<App/>, document.getElementById('app'))

// const post = new Post('Webpack Post Title', WebpackLogo);
// $("pre").addClass("code").html(post.toString())
//
// console.log("Post to String: ", post.toString());
// console.log("JSON: ", json);
// console.log("XML: ", xml);
// console.log("CSV: ", csv);