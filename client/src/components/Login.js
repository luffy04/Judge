import React, { Component } from 'react';
import Axios from 'axios';
import { store } from 'react-notifications-component';

class Login extends Component {
    constructor(){
        super(  );
        this.state={
            username:"anuj",
            password:"anuj"
        }
    }

    onChange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }

    submit=async ()=>{
        var response=await Axios.post('/loginsecure',{username:this.state.username,password:this.state.password});
        if(response.data="success"){
            console.log(JSON.parse(response.config.data).username)
            localStorage.setItem("username",JSON.parse(response.config.data).username);
            store.addNotification({
                title: "Success",
                message: "Successful Registration",
                type: "success",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                duration: 2000,
                onScreen: true
                }
            });
            this.props.toggle(JSON.parse(response.config.data).username);
            window.location.href="/";
        }else{
            store.addNotification({
                title: "Error",
                message: "Already Registered",
                type: "danger",
                insert: "top",
                container: "top-right",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeOut"],
                dismiss: {
                duration: 2000,
                onScreen: true
                }
            });
        }
    }

    render() {
        return (
            <div className="limiter">
                <div className="container-login100">
                    <div className="wrap-login100">
                        <span className="login100-form-title p-b-26">
                            Welcome
                        </span>
                        <span className="login100-form-title p-b-48">
                            <img src="/images/login_gif.gif" width="200" height="200" alt="Login" />
                        </span>

                        <div className="wrap-input100 validate-input">
                            <input className="input100" type="text" name="username" value={this.state.username} onChange={this.onChange}/>
                            <span className="focus-input100" data-placeholder="UserName"></span>
                        </div>
                        
                        <div className="wrap-input100 validate-input" data-validate="Enter password">
                            <span className="btn-show-pass">
                                <i className="zmdi zmdi-eye"></i>
                            </span>
                            <input className="input100" type="password" name="password" value={this.state.password} onChange={this.onChange}/>
                            <span className="focus-input100" data-placeholder="Password"></span>
                        </div>

                        <div className="container-login100-form-btn">
                            <div className="wrap-login100-form-btn">
                                <div className="login100-form-bgbtn"></div>
                                <button className="login100-form-btn" onClick={this.submit}>
                                    Login
                                </button>
                            </div>
                        </div>

                        <div className="text-center p-t-115">
                            <span className="txt1">
                                Don’t have an account?
                            </span>

                            <a className="txt2" href="/register">
                                Sign Up
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;