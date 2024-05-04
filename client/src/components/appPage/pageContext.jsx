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

    // Score of the game players
    const [score,setScore] = useState({yourScore:0,opponentScore:0});

    // Leader board data
    const [leaderBoardData,setLeaderBoardData] = useState([]);

    // The match of two players
    const [match,setMatch] = useState({});

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

    function startGame(color,match){
      fetch('http://localhost:9000/Score',{
          method: 'POST',
          headers:{
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              thisPlayer:id,
          }),
          credentials: 'include',
      }).then(response=>{
          if (response.status === 200){
              response.json().then((data)=>{
                setScore({yourScore:data.thisPlayerScore,opponentScore:data.theOpponentScore})
              })
          }
          else{
              response.json().then(data=>{
                alert(data.message);
              })
          }
      }).catch(error=>{
          alert(error);
      }); 
      setColor(color)
      setMatch(match)
      console.log("match ",match.player1,match.player2)
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

    function leaderBoard(leaderBoard){
      setLeaderBoardData(leaderBoard)
      setPage(5);
    }

    function createAccount(){
      setPage(6);
    }

    function manageProfile(){
      setPage(7);
    }

    return (  
        <PageContext.Provider value={{ page, login, logout, returnToSignIn, startGame, modifySettings, pastGame, leaderBoard, createAccount, id , color, returnToHome, manageProfile, pastGames, score, leaderBoardData,match}}>  
          {children}  
        </PageContext.Provider>  
      );  
}

export { PageContext, PageProvider };
