import React,{useContext} from 'react'
import "./index.css"
import Game from './game.jsx'
import {GameSocketProvider} from '../../contexts/GameSocketProvider'
import {PageContext} from '../../components/appPage/pageContext'

export default function GamePage(){
  const {id,color} = useContext(PageContext);
  return(
      <div className="GamePage">
          <h2>This is Game page</h2>
          {color? 
          <h3>You are player with white stone</h3>: 
          <h3>You are player with black stone</h3>}
            <GameSocketProvider id={id}>
              <Game color = {color}/>
            </GameSocketProvider>
      </div>
  );
}