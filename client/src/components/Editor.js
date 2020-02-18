import React, { Component } from 'react';
import { render } from "react-dom";
import AceEditor from "react-ace";
import './Editor.css'; 

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-eclipse";
 

class Editor extends Component {
    constructor(){

        super();
        this.state={
            theme:"eclipse",
            font:14,
            value:`
import java.util.*;
class Main{
    public static void main(String[] args){
        Scanner s=new Scanner(System.in);
        int n=s.nextInt();
        for(int i=0;i<n;i++){
            for(int j=0;j<=i;j++){
                System.out.print("*");
            }
            System.out.println();
        }
    }
}`,
            mode:"java",
            output:""
        }
        this.onChangeValue=this.onChangeValue.bind(this);
    }

    run=()=>{
        fetch('/run', {
            method: 'post',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code:this.state.value
            })
          }).then(res=>res.json())
          .then(data=>
            {   var output=data.stdout;
                {this.setState({output:output})}
            })
    }

    onChangeValue=(newValue)=> {
        this.setState({
            value:newValue
        })
      }

    

    render() {
        return (
            <div> 
                <div>
                    <div>
                        <label>Mode:</label>
                        <select onChange={this.onChange}>
                            <option >javascript</option>
                            <option>java</option>
                        </select>
                    </div>
                    <div>
                        <label>theme:</label>
                        <select onChange={this.onChange}>
                            <option>github</option>
                            <option>monokai</option>
                        </select>
                    </div>
                    <div>
                        <label>fontSize:</label>
                        <select onChange={this.onChange}>
                            <option>12</option>
                            <option>14</option>
                            <option>16</option>
                            <option>20</option>
                        </select>
                    </div>
                </div>
                <button onClick={this.run}>Run</button>
                <div>
                    <AceEditor
                        mode={this.state.mode}
                        theme={this.state.theme}
                        onChange={this.onChangeValue}
                        name="UNIQUE_ID_OF_DIV"
                        value={this.state.value}
                        height="200px"
                        editorProps={{ $blockScrolling: true }}
                        fontSize={this.state.font}
                    />
                </div>
                <span className="output">{this.state.output}</span>
            </div>
        );
    }
}

export default Editor;