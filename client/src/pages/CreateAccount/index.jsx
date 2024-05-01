import React,{useContext, useState} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"


export default function CreateAccountPage(){
    const { returnToSignIn } = useContext(PageContext);
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

    // Vox: This is my modified create account function
    // It is disabled by default for convenience
    const handleSubmit = (event) => {
        event.preventDefault()
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
            if (response.status === 200){
                response.json().then(data=>{alert(data.message);})
                returnToSignIn();
            }
            else{
                response.json().then(data=>{setError(data.message)})
            }
        }).catch(error=>{
            setError(error)
            alert('For development, you can directly login without reponse from backend')
            returnToSignIn();
        });
    }

    function handleReturnToSignIn() {
        returnToSignIn();
    }
    
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