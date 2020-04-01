import React, { Component } from 'react';
import './App.css';
import { Route } from 'react-router';
import socketIOClient from "socket.io-client";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import {BrowserRouter,Switch} from 'react-router-dom';
import Register from './components/Register';
import Compiler from './components/Compiler';
import Together from './components/Together';
import Login from './components/Login';

var username,socket;
class App extends Component {
  constructor(){
    super();
    this.state={
      username:""
    }
    socket = socketIOClient('http://localhost:3000/');
    if(localStorage.getItem("username")==null){
      username=prompt("Enter Your Name");
      socket.emit("push",username);
    }else{
      socket.emit("pushUser",localStorage.getItem("username"));
      this.state.username=localStorage.getItem("username");
    }

  }

  componentDidMount=()=>{

    socket.on("alertUser",(data,names)=>{
      username=prompt("Name is Already taken! Enter Another Name");
      while(names.indexOf(username)!=-1){
        username=prompt("Name is Already taken! Enter Another Name");
      }
      socket.emit("push",username);
    })

    socket.on("confrm",(data)=>{
      localStorage.setItem("username",data);
      this.state.username=data;
    })

  }

  signOut=()=>{
    localStorage.removeItem("username");
    this.setState({username:null});
  }

  Toggle=(username)=>{
    this.setState({username:username})
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="/"><img src="/images/icons/icon.png" width="32" height="32" alt="Compile Me"/>Compile Me!</a>
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
              <li className="nav-item">
                <a className="nav-link text-dark" href="/together">Code Together</a>
              </li>
            </ul>
            {/* {
              (this.state.username===null)?(
                <ul className="nav justify-content-end">
                  <li className="nav-item">
                    <a className="nav-link btn btn-light" href="/login">Login</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link btn btn-light" href="/register">Sign Up</a>
                  </li>
                </ul>
              ):(
                <ul className="nav justify-content-end">
                  <li className="nav-item">
                    <a className="nav-link btn btn-light" href="/logout">{this.state.username}</a>
                  </li>
                  <li className="nav-item">
                    <button className="nav-link btn btn-light" onClick={this.signOut}>Sign Out</button>
                  </li>
                </ul>
              )
            } */}
            {
              <ul className="nav justify-content-end">
                <li className="nav-item">{this.state.username}</li>
              </ul>
            }
          </div>
        </nav>
        <ReactNotification />
        <BrowserRouter>
          <Switch>
            <Route path="/" exact component={Compiler} />
            <Route path="/register" component={Register} />
            {/* <Route path="/login" component={()=><Login toggle={this.Toggle}/>}/> */}
            <Route path="/together" component={()=><Together toggle={this.Toggle} friend={this.state.username}/>}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
