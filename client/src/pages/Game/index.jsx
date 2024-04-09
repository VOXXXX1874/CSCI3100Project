import React,{useContext} from 'react'
import "./index.css"
import Game from './game.jsx'
import {GameSocketProvider} from '../../contexts/GameSocketProvider'
import {PageContext} from '../../components/appPage/pageContext'
import { ContactsProvider } from '../../contexts/ContactsProvider';
import { ConversationsProvider } from '../../contexts/ConversationsProvider';
import { SocketProvider } from '../../contexts/SocketProvider.js'

export default function GamePage(){
  const {id,color} = useContext(PageContext);

  return(
      <div className="GamePage">
          <h2>This is Game page</h2>
          {color? 
          <h3>You are player with white stone</h3>: 
          <h3>You are player with black stone</h3>}
            <GameSocketProvider id={id}>
              <SocketProvider id={id}>
                    <ContactsProvider>
                      <ConversationsProvider id={id}> 
                        <Game color = {color}/>
                      </ConversationsProvider>
                    </ContactsProvider>
              </SocketProvider>
            </GameSocketProvider>
      </div>
  );
}