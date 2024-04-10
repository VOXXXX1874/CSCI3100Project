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
import { MatchSocketProvider } from '../../contexts/MatchSocketProvider'
import StartGameButton from './StartGameButton'
import Header from '../../components/Header/Header';

export default function HomePage(){
    const {logout, startGame, modifySettings, pastGame, leaderBoard, id } = useContext(PageContext);
    // When the button is clicked, corresponding function will be called and page context is changed to jump to another state
    function handlePastGame(id){
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
          response.json().then(data=>{pastGame(data.replays)})
        }
        else{
          response.json().then(data=>{alert(data.message);})
        }
      });
    }

    function handleLeaderBoard(){
      leaderBoard();
    }

    // TODO: Pass acutal ID into ConversationsProvider
    // Vox: I find that the above handle function is not utilized.
    // Therefore I change all the onsubmit event to the handle function.
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
                  <MatchSocketProvider id = {id}>
                  <StartGameButton startGame = {startGame}/>
                  </MatchSocketProvider>
                <button className="PageButton" onClick={() => handlePastGame(id)}>
                  <div className="ButtonContent">
                  <img src={startGameImage} alt="Start Game" style={{ width: '20vw', height: '260px' }} />
                    <div className="ButtonText">Replay Past Games</div>
                  </div>
                </button>
                <button className="PageButton" onClick={handleLeaderBoard}>
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

