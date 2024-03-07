import React,{useState,useContext} from 'react';
import "./index.css"
import {PageContext} from '../../components/appPage/pageContext';

export default function LoginPage(){
    const {login} = useContext(PageContext);
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();
        // TO DO: Pass the loginInfo to the backend and wait for response
        console.log('Username:',username);
        console.log('Password:',password);
        login();
    }
    return(
        <div className="loginContainer">
            <h2>Entering any username and password to login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username<input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(event)=>setUsername(event.target.value)}
                    /></label>
                </div>
                <div>
                    <label>Password
                    <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event)=>setPassword(event.target.value)}
                    /></label>
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

