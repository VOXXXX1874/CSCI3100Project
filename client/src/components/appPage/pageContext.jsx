import React,{createContext,useState} from 'react';

// Create the page context
const PageContext = createContext();

// Provide the page context and related functions for other component
const PageProvider = ({children}) => {
    const [page,setPage] = useState(0);
    const [id, setId] = useState('');
    const [pastGames, setPastGames] = useState({})
    // black color is false and white color is true
    const [color,setColor] = useState(false);

    function login(username){
      setId(username);
      setPage(1);
    };

    function returnToHome(){
      setPage(1)
    }

    function logout(){
      setPage(0);
    }

    function returnToSignIn(){
      setPage(0);
    }

    function startGame(color){
      setColor(color)
      setPage(2);
    }

    function modifySettings(){
      setPage(3);
    }
    function pastGame(games){
      console.log(games)
      setPastGames(games)
      setPage(4);
    }
    function leaderBoard(){
      setPage(5);
    }

    function createAccount(){
      setPage(6);
    }

    function manageProfile(){
      setPage(7);
    }

    return (  
        <PageContext.Provider value={{ page, login, logout, returnToSignIn, startGame, modifySettings, pastGame, leaderBoard, createAccount, id , color, returnToHome, manageProfile, pastGames}}>  
          {children}  
        </PageContext.Provider>  
      );  
}

export { PageContext, PageProvider };
