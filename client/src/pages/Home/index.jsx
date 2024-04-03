import React,{useContext} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"
import startGameImage from './startGame.png';
import leaderBoardImage from './leaderBoard.png';
import Sidebar from '../../components/Sidebar';
import {Container, Col, Row } from 'react-bootstrap'; 

export default function HomePage(){
    const {logout, startGame, modifySettings, pastGame, leaderBoard } = useContext(PageContext);
    // When the button is clicked, corresponding function will be called and page context is changed to jump to another state
    // function handleStartGame(){
    //     startGame();
    // }
    // function handleSettings(){
    //     modifySettings();
    // }
    // function handleLogout(){
    //     logout();
    // }

    function handleStartGame(){
        startGame();
    }
    function handlePastGame(){
        pastGame();
    }
    function handleLeaderBoard(){
        leaderBoard();
    }

    return(
        <div className="HomePage">
            <h2>This is Home page</h2>
        <Container>
          <Row>
            <Col>
              <div className="PageChat">
                <Sidebar/>
              </div>
            </Col>
            <Col>
                <div className="ButtonsContainer">
                    {/* <button className="PageButton" onClick={handleStartGame}>Game</button>
                    <button className="PageButton" onClick={handleSettings}>Settings</button>
                    <button className="PageButton" onClick={handleLogout}>Logout</button> */}
                <button className="PageButton" onClick={startGame}>
                  <div className="ButtonContent">
                  <img src={startGameImage} alt="Start Game" style={{ width: '20vw', height: '260px' }} />
                    <div className="ButtonText">Start Game</div>
                  </div>
                </button>
                <button className="PageButton" onClick={pastGame}>
                  <div className="ButtonContent">
                  <img src={startGameImage} alt="Start Game" style={{ width: '20vw', height: '260px' }} />
                    <div className="ButtonText">Replay Past Games</div>
                  </div>
                </button>
                <button className="PageButton" onClick={leaderBoard}>
                  <div className="ButtonContent">
                  <img src={leaderBoardImage} alt="Start Game" style={{ width: '20vw', height: '270px' }} />
                    <div className="ButtonText">Leader Board</div>
                  </div>
                </button>
              </div>
            </Col>
            </Row>
        </Container>
    </div>
  );
}