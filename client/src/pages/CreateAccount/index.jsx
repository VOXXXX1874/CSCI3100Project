import React,{useContext, useState} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"

/* Pure function react component of the Create Account page */
export default function CreateAccountPage(){
    // Get the returnToSignIn function from the PageContext
    const { returnToSignIn } = useContext(PageContext);
    // Define the state variables for username, password, confirmPassword, and error
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    //const handleSubmit = (event) => {
    //    event.preventDefault();
    //    if (password !== confirmPassword) {
    //        setError("Passwords don't match");
    //        return;
    //    }
//
    //    console.log('Username:', username);
    //    console.log('Password:', password);
    //    console.log('Confirm Password:', confirmPassword);
//
    //    // Redirect to sign-in page if passwords match
    //    returnToSignIn();
    //};

    /* Function to handle the submit event of the form
        Input: event
        Output: none
        Description: This function will send a POST request to the backend to create an account
        Once the account is created, it will show a message and redirect to the sign-in page
    */
    const handleSubmit = (event) => {
        event.preventDefault()
        // Check if the username, password, and confirm password fulfill the requirements
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        if (password.length < 3) {
            setError('Password must be at least 3 characters long');
            return;
        }
        if (username.length < 3) {
            setError('Username must be at least 3 characters long');
            return;
        }
        // Send a POST request to the backend to create an account
        fetch('http://localhost:9000/CreateAccount',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username:username,
                password:password,
            }),
            credentials: 'include',
        }).then(response=>{
            // Check the response status
            if (response.status === 200){
                // If the response status is 200, the account is created successfully
                // Show a message and redirect to the sign-in page
                response.json().then(data=>{alert(data.message);})
                returnToSignIn();
            }
            else{
                // If the response status is not 200, show the error message
                response.json().then(data=>{setError(data.message)})
            }
        }).catch(error=>{
            // If there is an error, show the error message
            setError(error)
            alert('For development, you can directly login without reponse from backend')
            returnToSignIn();
        });
    }

    /* Function to handle the return to sign-in event
        Input: none
        Output: none
        Description: This function will call the returnToSignIn function from the PageContext
    */
    function handleReturnToSignIn() {
        returnToSignIn();
    }
    
    // Return the JSX of the Create Account page
    return(
        <div className="creatAccountContainer">
            <h1>Create an account</h1>
            <a style={{ display: 'inline' }}>Already have an account?</a>
            <a style={{ display: 'inline' }} className="signUpText" onClick={handleReturnToSignIn}> Sign in</a>
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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" className="createAccountButton">CREATE ACCOUNT</button>
            </form>
        </div>
    );
}