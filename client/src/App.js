import './App.css';
import {AuthContext} from './components/authentication/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import {useEffect,useState} from 'react';

export default function App(){
  const contextType = AuthContext;
  const [apiResponse,setResponse] = useState("");
  useEffect(() => {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => setResponse(res))
        .catch(err => err);
  },[])

  const isLoggedIn = contextType
  return (
    <div className="App">
      {isLoggedIn ? <Login/>:<Home/>}
      <p className="App-test">{apiResponse}</p>
    </div>
  );
}
