import {PageContext} from './components/appPage/pageContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import GamePage from './pages/Game';
import SettingsPage from './pages/Settings';
import {useEffect,useContext,useState} from 'react';
import "./App.css"

// Map different page context to different pages so that the application knows which page to show.
const PagesMap = {
  0:<LoginPage/>,
  1:<HomePage/>,
  2:<GamePage/>,
  3:<SettingsPage/>,
}

export default function App(){
  // Get the page context through useContext() function. The context is defined in pageContext.jsx
  const {page} = useContext(PageContext);
  // The apiResponse is just for test. It stores the response from backend.
  const [apiResponse,setResponse] = useState("");
  // When the component is rendered, the function is called to fetch testAPI information from backend.
  useEffect(() => {
    // async function. Try to follow this formula instead of callback hell
    fetch("http://localhost:9000/testAPI")
        .then(res => res.text())
        .then(res => setResponse(res))
        .catch(err => err);
  },[]);
  // Return the corresponding page of page context, which by default is 0:LoginPage, and response of backend
  return(
    <div className="App">
      {PagesMap[page] || PagesMap[0]}
      <p className="ApiTest">{apiResponse}</p>
    </div>
  );
}
