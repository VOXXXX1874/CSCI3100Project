import React,{useContext} from 'react'
import "./index.css"
import Game from './game.jsx'
import {GameSocketProvider} from '../../contexts/GameSocketProvider'
import {PageContext} from '../../components/appPage/pageContext'
import { ContactsProvider } from '../../contexts/ContactsProvider';
import { ConversationsProvider } from '../../contexts/ConversationsProvider';
import { SocketProvider } from '../../contexts/SocketProvider.js'
import Header from '../../components/Header/Header.js'

export default function GamePage(){
  const {id,color} = useContext(PageContext);

  return(
      <div className="GamePage">
        <Header/>
          {color? 
          <h3 className="head">Your stone: White. The start time is {new Date().toUTCString()}</h3>: 
          <h3 className="head">Your stone: Black. The start time is {new Date().toUTCString()}</h3>}
          <p>Your score is {Math.floor(Math.random() * 5)} and your opponent score is {Math.floor(Math.random() * 5)}</p>
            <GameSocketProvider id={id}>
              <SocketProvider id={id}>
                    <ContactsProvider>
                      <ConversationsProvider id={id}> 
                        <Game color = {color} startTime = {new Date()}/>
                      </ConversationsProvider>
                    </ContactsProvider>
              </SocketProvider>
            </GameSocketProvider>
      </div>
  );
}