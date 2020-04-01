import React, { Component } from 'react';
import socketIOClient from "socket.io-client";
import AceEditor from "react-ace";
import axios from 'axios';
import { store } from 'react-notifications-component';
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-terminal";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-eclipse";

var username;
var names=[];
var pendingReq;
const socket = socketIOClient('http://localhost:3000/');

class Together extends Component {
    constructor(props){
        super();
        var show=localStorage.getItem("room")?true:false;
        console.log(show);
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
            names:[],
            list:[],
            room:[],
            show:show
        }
        socket.on("chat",(Data)=>{
            console.log(Data);
        })
        {this.call()};
    }

    componentDidMount=()=>{

        if(localStorage.getItem("room")){
            socket.emit("enter",localStorage.getItem("room"));
        }

        socket.on("setAll",(data)=>{
            this.setState({names:data})
        })

        socket.on("roomJoin",(roomid,name)=>{
            if(localStorage.getItem("username")==name){
                console.log("done");
                this.setState({show:true});
                socket.emit("createid",roomid);
                localStorage.setItem("room",roomid);
                var room=this.state.room;
                room.push(roomid);
                this.setState({room});
            }
        })

        socket.on("confrmRoom",(name,id)=>{
            var room=this.state.room;
            room.push(name);
            localStorage.setItem("room",room);
            this.setState({room});
            this.setState({show:true})
            socket.emit("create",name);
            socket.emit("roomReq",name,id);
            var list=[];
            this.setState({list});
        })

        socket.on("alertRoom",(room,id)=>{
            var rooms=prompt("Room is Already taken!! Enter Another Room Name");
            while(room.indexOf(rooms)!=-1){ 
                rooms=prompt("Room is Already taken!! Enter Another Room Name"); rooms=prompt("Room is Already taken!! Enter Another Room Name");
            }
            socket.emit("roomPush",rooms,id);
        })

        socket.on("sendBack",(from,to)=>{
            if(localStorage.getItem("username")==to){
                const list=this.state.list;
                list.push(from);
                this.setState({list});
            }
        })

        socket.on("back",(content,user)=>{
            if(localStorage.getItem("username")!=user){
                this.setState({value:content})
            }
        })

        socket.on("closingConfirm",(room)=>{
            if(localStorage.getItem("room")==room){
                store.addNotification({
                    title: "Information",
                    message: "Friend has left the room",
                    type: "info",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeOut"],
                    dismiss: {
                      duration: 5000,
                      onScreen: true
                    }
                });
                this.setState({show:false});
                localStorage.removeItem("room");   
            }
        })
    }

    call=async ()=>{
        socket.emit("getAll");
    }

    handleChange=(event)=>{
        this.setState({mode:event.target.value});
    }

    Exit=()=>{
        this.setState({show:false});
        socket.emit("closing",localStorage.getItem("room"));
        localStorage.removeItem("room");   
    }

    Accept=(e)=>{
        var id=e.target.parentElement.getAttribute('value');
        var name=prompt("Room");
        socket.emit("roomPush",name,id);
    }

    Reject=(e)=>{
        var id=e.target.parentElement.getAttribute('value');
        var index=this.state.list.indexOf(id);
        var list=this.state.list;
        if(index!=-1) list.splice(index,1);
        this.setState({list});
    }

    request=(e)=>{
        var to=e.target.parentElement.getAttribute('value');
        socket.emit("requestSend",localStorage.getItem("username"),to);
    }

    ChangeTheme=(event)=>{
        this.setState({theme:event.target.value})
    }

    onChangeValue=(newValue)=>{
        this.setState({value:newValue})
        if(localStorage.getItem("room")){
            socket.emit("change",this.state.value,localStorage.getItem("username"),localStorage.getItem("room"));
        }
    }

    run=async ()=>{
        const response = await axios.post('/run', { code: this.state.value ,mode:this.state.mode});
        this.setState({output:response.data});
    }

    render() {
        const list=this.state.list;
        var listItems=this.state.names.map((name)=>{
            return <li key={name} value={name}>{name}<button style={{marginRight:"2px",background:"red"}} onClick={this.request}>request</button></li>
        })
        
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
                <div style={{display:"flex"}}>
                    {!this.state.show ? <div>
                        <ul>{listItems}</ul>
                    </div>:""}
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
                        <pre style={{background:"yellow"}}>{this.state.output}</pre>
                    </div>
                    {!this.state.show ? <div>
                        <ul>
                            {list.map((name)=>{return (<li key={name} value={name}>{name}<button onClick={this.Accept}>Accept</button><button onClick={this.Reject}>Reject</button></li>)})}
                        </ul>
                    </div>:""}
                    {this.state.show ? <div>
                        <button onClick={this.Exit}>Exit</button>
                    </div>:""}
                </div>
                
                
            </div>
        );
    }
}

export default Together;