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
          <h3>Your stone: White</h3>: 
          <h3>Your stone: Black</h3>}
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