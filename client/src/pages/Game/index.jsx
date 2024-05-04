import React,{useContext} from 'react'
import "./index.css"
import Game from './game.jsx'
import {PageContext} from '../../components/appPage/pageContext'
import { ContactsProvider } from '../../contexts/ContactsProvider';
import { ConversationsProvider } from '../../contexts/ConversationsProvider';
import Header from '../../components/Header/Header.js'

export default function GamePage(){
  const {id,color,score} = useContext(PageContext);

  return(
      <div className="GamePage">
        <Header/>
          {color? 
          <h3 className="head">Your({id}) stone: White. The start time is {new Date().toUTCString()}</h3>: 
          <h3 className="head">Your({id}) stone: Black. The start time is {new Date().toUTCString()}</h3>}
          <p>Your score is {score.yourScore} and your opponent score is {score.opponentScore}</p>
            <ContactsProvider>
              <ConversationsProvider id={id}> 
                <Game color = {color} startTime = {new Date()}/>
              </ConversationsProvider>
            </ContactsProvider>
      </div>
  );
}