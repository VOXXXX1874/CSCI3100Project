import React,{useContext} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"
import startGameImage from './startGame.png';
import leaderBoardImage from './leaderBoard.png';
import Sidebar from '../../components/Sidebar';
import {Container, Col, Row } from 'react-bootstrap'; 
import { ContactsProvider } from '../../contexts/ContactsProvider';
import { ConversationsProvider, useConversations } from '../../contexts/ConversationsProvider';
import OpenConversation from '../../components/OpenConversation';
import { SocketProvider } from '../../contexts/SocketProvider'
import StartGameButton from './StartGameButton'
import Header from '../../components/Header/Header';

/* The HomePage component is used to display the home page
    The home page contains a button to start a game, a button to replay past games, and a button to view the leaderboard
    The user can click on the start game button to start a game
    The user can click on the replay past games button to view the past games
    The user can click on the leaderboard button to view the leaderboard
*/
export default function HomePage(){
  // Get the page context through useContext() function. The context is defined in pageContext.jsx
    const {logout, startGame, modifySettings, pastGame, leaderBoard, id} = useContext(PageContext);

    // When the button is clicked, corresponding function will be called and page context is changed to jump to another state
    function handlePastGame(id){
      // Get the past games of the user from the backend
      fetch('http://localhost:9000/replay',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username:id,
        }),
        credentials: 'include',
      }).then(response=>{
        if(response.status === 200){
          // Jump to the past games page with the past games data
          response.json().then(data=>{pastGame(data.replays)})
        }
        else{
          response.json().then(data=>{alert(data.message);})
        }
      });
    }

    // When the button is clicked, corresponding function will be called and page context is changed to jump to another state
    function handleLeaderBoard(){
      // Get the leaderboard data from the backend
      fetch('http://localhost:9000/LeaderBoard',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).then(response=>{
        if (response.status === 200){
            response.json().then((data)=>{
              // Jump to the leaderboard page with the leaderboard data
              leaderBoard(data.leaderBoard)
            })
        }
        else{ // If the backend returns a status code of 400, display the error message and set the leaderboard data to default
            response.json().then(data=>{
              alert(data.message);
            })
            leaderBoard([
                { rank: 1, name: 'Voxx', points: 3 },
                { rank: 2, name: 'Vox', points: 2 },
                { rank: 3, name: 'Lana', points: 1 },
                { rank: 4, name: 'Voxxx', points: 1 },
            ])
        }
      }).catch(error=>{
        alert(error);
        leaderBoard([
            { rank: 1, name: 'Voxx', points: 3 },
            { rank: 2, name: 'Vox', points: 2 },
            { rank: 3, name: 'Lana', points: 1 },
            { rank: 4, name: 'Voxxx', points: 1 },
        ])
      }); 
    }

    // The return statement contains the JSX code to render the HomePage component
    return(
        <div className="HomePage">
          <Header></Header>
        {/* <Container>
          <Row> */}
            {/* <SocketProvider id={id}>
              <ContactsProvider>
                <ConversationsProvider id={id}> 
                  <Col>
                    <div className="PageChat">
                      <Sidebar id={id}/>
                    </div>
                  </Col>
                  <Col>
                    <OpenConversation/>
                  </Col>

                </ConversationsProvider>
              </ContactsProvider>
            //   </SocketProvider> */}
            {/* // <Col> */}
                <div className="ButtonsContainer">
                  <StartGameButton startGame = {startGame}/>
                <button className="PageButton" onClick={() => handlePastGame(id)}>
                  <div className="ButtonContent">
                  <img src={startGameImage} alt="Start Game" style={{ width: '20vw', height: '260px' }} />
                    <div className="ButtonText">Replay Past Games</div>
                  </div>
                </button>
                <button className="PageButton" onClick={() => handleLeaderBoard()}>
                  <div className="ButtonContent">
                  <img src={leaderBoardImage} alt="Start Game" style={{ width: '20vw', height: '270px' }} />
                    <div className="ButtonText">Leader Board</div>
                  </div>
                </button>
              </div>
            {/* </Col>

            </Row>
        </Container> */}
    </div>
  );
}

