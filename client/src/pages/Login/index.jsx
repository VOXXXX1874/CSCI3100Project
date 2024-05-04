import React, { useState, useContext } from 'react';
import "./index.css";
import { PageContext } from '../../components/appPage/pageContext';

/* The LoginPage component is used to display the login page
    The login page contains a form with two input fields for the username and the password
    The user can enter the username and the password and click the sign in button to log in
    The user can also click the create an account link to go to the create account page
*/
export default function LoginPage() {
    // Get the page context through useContext() function. The context is defined in pageContext.jsx
    const { login, createAccount } = useContext(PageContext);
    // Input username and password are stored in the state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    /* The handleSubmit function is used to handle the submit event of the form
        The function sends a POST request to the backend with the username and the password
        If the backend returns a status code of 200, the user is logged in
        If the backend returns a status code of 400, the user is not logged in
    */
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check if username or password is empty
        if (!username || !password) {
            alert("Both username and password are required.");
            return;
        }

        // Proceed with submitting the credentials
        fetch('http://localhost:9000/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
            credentials: 'include',
        }).then(response => {
            if (response.status === 200) {
                response.json().then(data => {
                    alert(data.message);
                    login(username);
                });
            } else {
                response.json().then(data => {
                    alert(data.message);
                });
            }
        }).catch(error => {
            alert(error);
            alert('For development, you can directly login without response from backend');
            login(username);
        });
    }

    /* The handleCreateAccount function is used to handle the click event of the create an account link
        The function calls the createAccount function to go to the create account page
    */
    function handleCreateAccount() {
        createAccount();
    }

    /* The return statement contains the JSX code to render the LoginPage component
        The component contains a header, a form with two input fields for the username and the password, and a sign in button
        The user can enter the username and the password and click the sign in button to log in
        The user can also click the create an account link to go to the create account page
    */
    return (
        <div className="loginContainer">
            <h1>Sign in</h1>
            <a style={{ display: 'inline' }}>New user?</a>
            <a style={{ display: 'inline' }} className="signUpText" onClick={handleCreateAccount}> Create an account</a>
            <p></p>
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
