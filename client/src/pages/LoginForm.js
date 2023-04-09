import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { apiLogin } from '../api/pokeAPI';
import { apiGetAuthUser } from "../api/pokeAPI";
import "../styles/LoginForm.css";

function AdminLogin() {

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

        if (!error && resData && resData.isAdmin) {
            console.log(resData);
            setCredentialError(false);
            navigate("/admin");

            } else {
            setCredentialError(true);
            console.log("login failed");
        }
    };

    const getCurrentUser = async () => {
      var { data } = await apiGetAuthUser();
      console.log(data);
      var adminGuy = data.data.is_admin;

      if (adminGuy === 'true') {
          console.log("I am true");
          navigate("/admin");
      } else {
          console.log("I am false ");
      }
  };

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    useEffect(() => {}, [
        data.username,
        data.password,
      ]);

    useEffect(()=> {
      getCurrentUser()
    }, []); 

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <span className="login-title">Admin Login</span>
                <input
                    className="login-input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={changeHandler}
                />
                <input
                    className="login-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={changeHandler}
                />
                <button className="login-button" type="submit">
                    Login
                </button>
            </form>
            {credentialError ? <h1 className="login-error">Credentials Entered Incorrectly</h1> : ''}
        </div>
    );
};

export default AdminLogin;
