import React, { useState, useContext } from 'react';
import "./index.css";
import { PageContext } from '../../components/appPage/pageContext';

export default function LoginPage() {
    const { login } = useContext(PageContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:', username);
        console.log('Password:', password);
        login(username);
    }

    return (
        <div className="loginContainer">
            <h1>Sign in</h1>
            <p className="signUpText">New user? <a href="">Create an account</a></p>

            <form onSubmit={handleSubmit} className="loginForm">
                <div className="inputContainer">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="inputContainer">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit" className="loginButton">SIGN IN</button>
            </form>
        </div>
    );
}
