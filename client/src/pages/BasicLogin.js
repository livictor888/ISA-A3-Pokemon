import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { apiLogin } from '../api/pokeAPI';
import "../styles/BasicLogin.css";

function BasicLogin() {

    const navigate = useNavigate();
    const [ data, setData ] = useState({
        username: "",
        password: ""
    });

    const [ credentialError, setCredentialError ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        checkUser();
    };

    const checkUser = async () => {
        const { error, data: resData } = await apiLogin(data);

        if (!error && resData) {
            console.log(resData);
            setCredentialError(false);
            navigate("/");
        } else {
            setCredentialError(true);
            console.log("login failed");
        }
    };

    const redirectToLoginForm = () => {
        navigate("/admin-login"); // Replace "/admin-login" with the appropriate route path for LoginForm.js
    };

    const redirectToSignUpForm = () => {
        navigate("/signup");
    };

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    useEffect(() => {}, [
        data.username,
        data.password,
    ]);

    return (
        <div className="basic-login-container">
            <form className="basic-login-form" onSubmit={handleSubmit}>
                <span className="basic-login-title">Login</span>
                <input
                    className="basic-login-input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={changeHandler}
                />
                <input
                    className="basic-login-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={changeHandler}
                />
                <button className="basic-login-button" type="submit">
                    Login
                </button>
            </form>
            <button className="basic-login-button" onClick={redirectToLoginForm}>
                Go to Admin Login
            </button>
            <button className="basic-login-button" onClick={redirectToSignUpForm}>
                Signup for an Account
            </button>
            {credentialError ? <h1 className="basic-login-error">Credentials Entered Incorrectly</h1> : ''}
        </div>
    );
};

export default BasicLogin;
