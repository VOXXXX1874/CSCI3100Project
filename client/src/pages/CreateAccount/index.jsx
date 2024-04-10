import React,{useContext, useState} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"
import LoginPage from '../Login';


export default function CreateAccountPage(){
    const { login, createAccount, signInPage } = useContext(PageContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleSubmit (){
        console.log('another test');
    }

    // const handleCreateAccount = async (event) => {
    //     event.preventDefault();
    
    //     // Obtain form input values
    //     const username = document.getElementById('username').value;
    //     const password = document.getElementById('password').value;
    
    //     try {
    //         const response = await fetch('http://localhost:9000/CreateAccount', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 username: username,
    //                 password: password,
    //             }),
    //             credentials: 'include',
    //         });
    
    //         if (response.ok) {
    //             const data = await response.json();
    //             alert(data.message);
    //             // Optionally, automatically log in the user after creating the account
    //             login(username);
    //         } else {
    //             const data = await response.json();
    //             alert(data.message);
    //         }
    //     } catch (error) {
    //         alert(error);
    //         alert('For development, you can directly create an account without response from backend');
    //         // Optionally, handle error scenarios, e.g., display an error message to the user
    //     }
    // }
    
    function handleSignIn() {
        login();
    }
    return(
        <div className="creatAccountContainer">
            <h1>Create Account</h1>

            <p></p>
            <a>Already have an account? </a>
            <a className="signUpText" onClick={handleSignIn}>Sign in</a>
            <p></p>

            <form onSubmit={handleSubmit} className="createAccountForm">
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
                <div className="inputContainer">
                    <label htmlFor="password">Confirm Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit" className="createAccountButton">CREATE ACCOUNT</button>
            </form>
        </div>
        
    );

}