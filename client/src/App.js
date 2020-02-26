import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
import Editor from './components/Editor';
import Compiler from './components/Compiler';

class App extends Component {
  render() {
    return (
      <div>
        {/* <Editor /> */}
        <Compiler />
      </div>
    );
  }
}

export default App;
