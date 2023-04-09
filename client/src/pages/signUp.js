import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiSignup } from '../api/pokeAPI';
import "../styles/SignUp.css";


function Signup() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        username: "",
        password: "",
        email: ""
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      apiSignup(data)
        .then(() => {
          // Redirect to /login route upon successful registration
          navigate('/login');
        })
        .catch((error) => {
          // Handle error (e.g., display an error message on the signup page)
        });
    };  

    const changeHandler = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    useEffect(() => {}, [
        data.username,
        data.password,
        data.email
    ]);

    return (
        <div className="sign-up-container">
            <form className="sign-up-form" onSubmit={handleSubmit}>
                <span className="sign-up-title">Admin Signup</span>
                <input
                    className="sign-up-input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={changeHandler}
                />
                <input
                    className="sign-up-input"
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={changeHandler}
                />
                <input
                    className="sign-up-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={changeHandler}
                />
                <button className="sign-up-button" type="submit">
                    Signup
                </button>
            </form>
        </div>
    );
}

export default Signup;
