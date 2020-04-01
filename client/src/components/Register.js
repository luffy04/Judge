import React, { Component } from 'react';
import axios from 'axios';
import { store } from 'react-notifications-component';

class Register extends Component {
    constructor(){
        super();
        this.state={
            username:"anuj",
            email:"anujjha041998@gmail.com",
            password:"anuj"
        }
    }

    onChange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }

    Register=async ()=>{
        const response = await axios.post('/registers', { username:this.state.username ,email:this.state.email, password:this.state.password});
        if(response.data.code="ER_DUP_ENTRY"){
            store.addNotification({
            title: "Error",
            message: "Already Registered",
            type: "danger",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          });
        }else{
            store.addNotification({
            title: "Success",
            message: "Successful Registration",
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          });
        }
    }

    render() {
        return (
            <div className="container">
                <div className="limiter">
                    <div className="container-login100">
                        <div className="wrap-login100">
                            <span className="login100-form-title p-b-26">
                                Welcome
                            </span>
                            <span className="login100-form-title p-b-48">
                                <img src="/images/register_gif.gif" width="200" height="200" alt="Register"/>
                            </span>
                            <div className="wrap-input100 validate-input">
                                <input className="input100" type="text" name="username" value={this.state.username} onChange={this.onChange} required="required"/>
                                <span className="focus-input100" data-placeholder="Username"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Valid email is: a@b.c">
                                <input className="input100" type="text" name="email" value={this.state.email} onChange={this.onChange} required="required"/>
                                <span className="focus-input100" data-placeholder="Email"></span>
                            </div>

                            <div className="wrap-input100 validate-input" data-validate="Enter password">
                                <span className="btn-show-pass">
                                    <i className="zmdi zmdi-eye"></i>
                                </span>
                                <input className="input100" type="password" name="password" value={this.state.password} onChange={this.onChange} required="required "/>
                                <span className="focus-input100" data-placeholder="Password"></span>
                            </div>
                            
                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"></div>
                                    <button className="login100-form-btn" onClick={this.Register}>Register</button>
                                </div>
                            </div>

                            <div className="text-center p-t-115">
                                <span className="txt1">
                                    Already have an account?
                                </span>

                                <a className="txt2" href="/login">
                                    Sign In
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;