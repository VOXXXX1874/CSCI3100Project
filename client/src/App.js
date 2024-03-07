import {PageContext} from './components/appPage/pageContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import GamePage from './pages/Game';
import SettingsPage from './pages/Settings';
import {useEffect,useContext,useState} from 'react';
import "./App.css"

const PagesMap = {
  0:<LoginPage/>,
  1:<HomePage/>,
  2:<GamePage/>,
  3:<SettingsPage/>,
}

export default function App(){
  const {page} = useContext(PageContext);
  const [apiResponse,setResponse] = useState("");// should i remove this state?
  useEffect(() => {
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => setResponse(res))
        .catch(err => err);
  },[]);
  return(
    <div className="App">
      {PagesMap[page] || PagesMap[0]}
      <p className="ApiTest">{apiResponse}</p>
    </div>
  );
}
