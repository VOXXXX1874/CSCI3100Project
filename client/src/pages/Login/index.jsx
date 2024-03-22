import React,{useState,useContext,useEffect} from 'react';
import "./index.css"
import {PageContext} from '../../components/appPage/pageContext';

export default function LoginPage(){
    const {login} = useContext(PageContext); // Get the login function provided by PageContext. It will change page context from 0 to 1:HomePage
    const [username,setUsername] = useState(""); // state(you can treat it as static variable) of Username
    const [password,setPassword] = useState(""); // state(you can treat it as static variable) of Password
    const [defaultAccount,setDefaultAccount] = useState(""); // Default account for testing

    const handleSubmit = async(event) => {
        // Vox: I'm going to add the basic login here for testing
        event.preventDefault();
        console.log('Username:',username);
        console.log('Password:',password);
        try{
            const response = await fetch('http://localhost:9000/Login',{
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username:username,
                    password:password,
                }),
            });
            if (response.status === 200){
                alert('Login Success');
            }
        }catch(error){
            console.error('Error:',error);
        }
        login();
    }

    useEffect(()=>{
        // Same as testAPI, fetch the default username and password from backend.
        fetch("http://localhost:9000/testLogin")
            .then(res => res.text())
            .then(res => setDefaultAccount(res))
            .catch(err => err)
    },[]);

    // A form of login
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

