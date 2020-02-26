import React, { Component } from 'react';
import AceEditor from "react-ace";
// import './Editor.css'; 
import axios from 'axios';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-eclipse";

class Compiler extends Component {
    constructor(){
        super();
        this.state={
            theme:"eclipse",
            font:14,
            value:`
#include<iostream>
using namespace std;
int main(){
    int n=5;
    for(int i=0;i<n;i++){
        for(int j=0;j<=i;j++){
            cout<<"*";
        }
        cout<<endl;
    }
    return 0;
}
            `,
            mode:"java",
            output:"",
        }
    }

    handleChange=(event)=>{
        this.setState({mode:event.target.value});
    }

    ChangeTheme=(event)=>{
        this.setState({theme:event.target.value})
    }

    run=async ()=>{
        // fetch('/run', {
        //     method: 'post',
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //         code:this.state.value
        //     })
        //   }).then(res=>res.json())
        //   .then(data=>
        //     {   var output=data.stdout;
        //         {this.setState({output:output})}
        //     })
        const response = await axios.post('/run', { code: this.state.value });
        this.setState({output:response.data});
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="/"><img src="/images/icons/icon.png" width="32" height="32" />Compile Me!</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="/">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link text-dark" href="/subject">Add Subject</a>
                            </li>
                        </ul>
                        <ul className="nav justify-content-end">
                            <li className="nav-item">
                                <a className="nav-link btn btn-light" href="login">Login</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link btn btn-light" href="/register">Sign Up</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link btn btn-light" href="/logout">Sign Out</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div id="buttons" style={{marginRight:"10px"}}>
                    <select className="btn btn-primary dropdown-toggle" value={this.state.mode} onChange={this.handleChange}>
                        <option value="java">java</option>
                        <option value="javascript">javascript</option>
                    </select>
                    <select className="btn btn-danger dropdown-toggle" value={this.state.platform} onChange={this.ChangeTheme}>
                        <option value="eclipse">eclipse</option>
                        <option value="terminal">terminal</option>
                        <option value="monokai">monokai</option>
                        <option value="github">github</option>
                    </select>
                    <button className="btn btn-success" onClick={this.run}>run</button>
                    <button className="btn btn-success" >Get Answer</button>
                </div>
                <div>
                    <AceEditor
                        mode={this.state.mode}
                        theme={this.state.theme}
                        onChange={this.onChangeValue}
                        name="UNIQUE_ID_OF_DIV"
                        value={this.state.value}
                        height="500px"
                        editorProps={{ $blockScrolling: true }}
                        fontSize={this.state.font}
                    />
                </div>
                <pre>{this.state.output}</pre>
            </div>
        );
    }
}

export default Compiler;