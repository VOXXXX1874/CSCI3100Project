import React from 'react'
import "./index.css"
import Game from './game.jsx'

export default function GamePage(){
  return(
      <div className="GamePage">
          <h2>This is Game page</h2>
          <Game/>
      </div>
  );
}