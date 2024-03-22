import React,{useState,useContext,useEffect} from 'react';
import "./index.css"
import {PageContext} from '../../components/appPage/pageContext';

export default function LoginPage(){
    const {login} = useContext(PageContext); // Get the login function provided by PageContext. It will change page state from 0 to 1:HomePage
    const [username,setUsername] = useState(""); // Username
    const [password,setPassword] = useState(""); // Password
    const [defaultAccount,setDefaultAccount] = useState(""); // Default account for test

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Username:',username);
        console.log('Password:',password);
        login();
    }

    useEffect(()=>{
        fetch("http://localhost:9000/testLogin")
            .then(res => res.text())
            .then(res => setDefaultAccount(res))
            .catch(err => err)
    },[]);

    return(
        <div className="loginContainer">
            <h2>You will see the account if the backend and database is set up and started properly</h2>
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
            <p className="defaultAccount">{defaultAccount}</p>
        </div>
    );
}

