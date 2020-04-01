import React, { Component } from 'react';
import AceEditor from "react-ace";
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
import java.util.*;
class Main{
    public static void main(String[] args){
        Scanner s=new Scanner(System.in);
        int n=s.nextInt();
        for(int i=0;i<n;i++){
            System.out.print("*");
        }
    }
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

    onChangeValue=(newValue)=>{
        this.setState({value:newValue})
    }
    run=async ()=>{
        const response = await axios.post('/run', { code: this.state.value ,mode:this.state.mode});
        this.setState({output:response.data});
    }

    render() {
        return (
            <div>
                <div id="buttons" style={{marginRight:"10px"}}>
                    <select className="btn btn-primary dropdown-toggle" value={this.state.mode} onChange={this.handleChange}>
                        <option value="java">java</option>
                        <option value="c_cpp">c_cpp</option>
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
                <pre style={{background:"yellow"}}>{this.state.output}</pre>
            </div>
        );
    }
}

export default Compiler;