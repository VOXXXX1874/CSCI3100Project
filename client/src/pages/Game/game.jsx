import React, {useState,useEffect} from 'react'
import {useGameSocket} from '../../contexts/GameSocketProvider'
import {Modal,Button} from 'react-bootstrap';

import './game.css'

// Please refer to the React Tic Tac Toe tutorial. I might write some comment later.

function Square({value,onSquareClick,xIsNext}){
  const [isHovered,setIsHovered] = useState(false);

  const handleMouseEnter = ()=>{
    setIsHovered(true);
  }
  const handleMouseLeave = ()=>{
    setIsHovered(false);
  }

  const SquaresMap = {
    null:<button className={`square ${isHovered ? 'hovered' : ''} ${xIsNext ? 'HX':'HO'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onSquareClick}></button>,
    "X": <button className="square X" onMouseLeave={handleMouseLeave}></button>,
    "O": <button className="square O" onMouseLeave={handleMouseLeave}></button>,
  }

  return SquaresMap[value];
}
  
export default function Game({color}){
  // x stands for black and o stands for white
  const socket = useGameSocket()
  const [xIsNext,setXIsNext] = useState(true);
  const [history,setHistory] = useState([Array(361).fill(null)]);
  const [currentMove,setCurrentMove] = useState(0);
  const [winner,setWinner] = useState(null)
  const currentSquares = history[currentMove];
  
  useEffect(() => {
    if (socket == null) return

    socket.on('handle-play', (place,player)=>{
      let nextSquares = history[history.length-1]
      nextSquares[place] = player? "O":"X"
      setXIsNext(player)
      const nextHistory = [...history.slice(0,currentMove+1),nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length-1)
      setWinner(calculateWinner(history[currentMove]))
    })

    return () => socket.off('handle-play')
  }, [socket,history,currentMove])

  function summaryGame(){

  }
  //function jumpTo(nextMove){
  //  setCurrentMove(nextMove)
  //  setXIsNext(nextMove%2===0)
  //}
  //const moves = history.map((squares,move)=>{
  //  let description;
  //  if(move > 0){
  //    description = 'Go to move #' + move;
  //  }else{
  //    description = 'Go to game start';
  //  }
  //  return (
  //    <li key={move}>
  //      <button onClick={()=>jumpTo(move)}>{description}</button>
  //    </li>
  //  )
  //})
  let status = 'Next player: ' + (xIsNext ? 'Black':'White');
  console.log(xIsNext)
  return(
    <div className='game'>
      <div className="status">{status}</div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} playerColor={color} socket={socket}/>
      </div>
      <div className="game-info">
        <Button>Rectract</Button>
      </div>
      <Modal show={winner}>
        <GameEndModal summaryGame={summaryGame} winner={winner}/>
      </Modal>
    </div>
  );
}

function Board({xIsNext,squares,playerColor,socket}) {

  function handleClick(i){
    // xIsNext means black is next, in which player white color=true === xIsNext
    if(squares[i]||playerColor===xIsNext){
      return;
    }
    console.log(i)
    socket.emit('place-stone',i)
  }

  const rowsArray = [];
  const width =19;
  const height = 19;
  for(let i = 0; i < height; i++){
    const buttonsArray = [];
    for(let j = 0; j < width; j++){
      buttonsArray.push(
        <Square key = {`button-${j}`} value={squares[i*width+j]} onSquareClick={() => handleClick(i*width+j)} xIsNext={xIsNext}/>
      )
    }
    rowsArray.push(
      <div className="board-row" key={`row-${i}`}>
        {buttonsArray}
      </div>
    )
  }
  
  return (
    <>
    {rowsArray}
    </>
  );
}

function calculateWinner(squares) {
  const width = 19;
  const height = 19;

  const dirs = [
    [1,0], [-1,0], [0,1], [0,-1],
    [1,1], [1,-1], [-1,1], [-1,-1]
  ];

  // Iterate over each cell of the board
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const index = i * width + j;
      const currentPlayer = squares[index];
      if (currentPlayer === null) continue; // Skip if the cell is empty

      // Check for winning sequences in all directions
      for (const [dx, dy] of dirs) {
        let x = j, y = i, count = 1;
        for (let k = 0; k < 5; k++) {
          const newIndex = (y + dy) * width + (x + dx);
          if (newIndex < 0 || newIndex >= width * height) break; // Break if index is out of range
          if (squares[newIndex] !== currentPlayer) break; // Break if the sequence is interrupted
          y += dy;
          x += dx;
          count++;
        }
        if (count === 5) {
          // Winning sequence found, return the player ID
          console.log("WINNER: ", currentPlayer)
          return currentPlayer;
        }
      }
    }
  }
  // No winning sequence found
  console.log("no winning sequence")
  return null;
}

function GameEndModal({summaryGame, winner}) {
  let winnerColor = null
  if(winner==="X"){
    winnerColor = "black"
  }
  else if(winner==="O"){
    winnerColor = "white"
  }
  return (
    <>
      <Modal.Header closeButton>The player with {winnerColor} stone win!!!</Modal.Header>
      <Modal.Body>
        <Button onClick={summaryGame}>Return to Home</Button>
      </Modal.Body>
    </>
  )
}