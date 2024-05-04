import {PageContext} from './components/appPage/pageContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import GamePage from './pages/Game';
import SettingsPage from './pages/Settings';
import {useEffect,useContext,useState} from 'react';
import PastGamesPage from './pages/PastGames';
import LeaderBoardPage from './pages/LeaderBoard';
import "./App.css"
import CreateAccountPage from './pages/CreateAccount';
import ManageProfilePage from './pages/ManageProfile';
import { MatchSocketProvider } from './contexts/MatchSocketProvider';
import { SocketProvider } from './contexts/SocketProvider';
import {GameSocketProvider} from './contexts/GameSocketProvider';


// Map different page context to different pages so that the application knows which page to show.
const PagesMap = {
  0:<LoginPage/>,
  1:<HomePage/>,
  2:<GamePage/>,
  3:<SettingsPage/>,
  4:<PastGamesPage/>,
  5:<LeaderBoardPage/>,
  6:<CreateAccountPage/>,
  7:<ManageProfilePage/>
}

export default function App(){
  // Get the page context through useContext() function. The context is defined in pageContext.jsx
  const {page,id,login,setStates} = useContext(PageContext);

  useEffect(() => {
    fetch('http://localhost:9000/Login',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message:'Refresh'
        }),
        credentials: 'include',
    }).then(response=>{
        if (response.status === 200){
            response.json().then(data=>{
                login(data.username)
                setStates(data.state)
            })
        }
    }).catch(error=>{
        alert(error);
    }); 
  },[]);

  // Return the corresponding page of page context, which by default is 0:LoginPage, and response of backend
  if (page === 0){
    return(
      <div className="App">
        {PagesMap[page]}
      </div>
    );
  }
  else{
    return(
      <div className="App">
        <GameSocketProvider id={id}>
        <SocketProvider id={id}>
        <MatchSocketProvider id = {id}>
        {PagesMap[page]}
        </MatchSocketProvider>
        </SocketProvider>
        </GameSocketProvider>
      </div>
    );
  }
}
