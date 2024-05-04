import React,{useContext} from 'react'
import "./index.css"
import Game from './game.jsx'
import {PageContext} from '../../components/appPage/pageContext'
import { ContactsProvider } from '../../contexts/ContactsProvider';
import { ConversationsProvider } from '../../contexts/ConversationsProvider';
import Header from '../../components/Header/Header.js'

/* The GamePage component is used to display the game page
    The game page contains the game component
    The game component is used to play the game
*/
export default function GamePage(){
  // Get the required page context through useContext() function. The context is defined in pageContext.jsx
  const {id,color,score} = useContext(PageContext);

  /* The return statement contains the JSX code to render the GamePage component
      The component contains the header, the information about the game, and the game component
      The game component is used to play the game
  */
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