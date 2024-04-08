import React,{useState,useContext} from 'react';
import "./index.css";
import { PageContext } from '../../components/appPage/pageContext';

export default function LoginPage() {
<<<<<<< HEAD
    const { login, createAccount } = useContext(PageContext);
=======
    const { login } = useContext(PageContext);
>>>>>>> Dev
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // Submit the username and password as json to remote 'http://localhost:9000/Login'
    // If response status is 200, then store the returned cookie and call login
    // Otherwise alert the error message
    const handleSubmit = async(event) => {
        event.preventDefault();
        fetch('http://localhost:9000/Login',{
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
                login(username);
            }
            else{
                response.json().then(data=>{alert(data.message);})
            }
        }).catch(error=>{
            alert(error);
            alert('For development, you can directly login without reponse from backend')
            login(username)
        });
<<<<<<< HEAD

        
    }

    function handleCreateAccount() {
        createAccount();
=======
>>>>>>> Dev
    }

    return (
        <div className="loginContainer">
            <h1>Sign in</h1>
<<<<<<< HEAD
            <a>New user?</a>
            <p className="signUpText" onClick={handleCreateAccount}> Create an account</p>
=======
            <p className="signUpText">New user? <a href="">Create an account</a></p>
>>>>>>> Dev

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
