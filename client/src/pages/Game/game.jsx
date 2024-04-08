import React, {useState} from 'react'
<<<<<<< HEAD
=======
import {useGameSocket} from '../../contexts/GameSocketProvider'

>>>>>>> Dev
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
  
<<<<<<< HEAD
export default function Game(){
=======
export default function Game({color}){
  // x stands for black and o stands for white
  const socket = useGameSocket()
>>>>>>> Dev
  const [xIsNext,setXIsNext] = useState(true);
  const [history,setHistory] = useState([Array(225).fill(null)]);
  const [currentMove,setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0,currentMove+1),nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1)
    setXIsNext(!xIsNext);
  }
<<<<<<< HEAD
  function jumpTo(nextMove){
    setCurrentMove(nextMove)
    setXIsNext(nextMove%2===0)
  }
  const moves = history.map((squares,move)=>{
    let description;
    if(move > 0){
      description = 'Go to move #' + move;
    }else{
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={()=>jumpTo(move)}>{description}</button>
      </li>
    )
  })
=======
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
>>>>>>> Dev
  const winner = calculateWinner(currentSquares);
  let status;
  if(winner){
    status = 'Winner: ' + winner;
  }else{
<<<<<<< HEAD
    status = 'Next player: ' + (xIsNext ? 'X':'O');
=======
    status = 'Next player: ' + (xIsNext ? 'Black':'White');
>>>>>>> Dev
  }
  return(
    <div className='game'>
      <div className="status">{status}</div>
      <div className="game-board">
<<<<<<< HEAD
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
=======
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} playerColor={color} socket={socket}/>
      </div>
      {/*<div className="game-info">
        <ol>{moves}</ol>
      </div>*/}
>>>>>>> Dev
    </div>
  );
}

<<<<<<< HEAD
function Board({xIsNext,squares,onPlay}) {

  function handleClick(i){
    if(squares[i]||calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";
    }
    else{
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
=======
function Board({xIsNext,squares,onPlay,playerColor,socket}) {

  function handleClick(i){
    if(squares[i]||calculateWinner(squares)||playerColor===xIsNext){
      return;
    }
    socket.emit('place-stone',{i})
>>>>>>> Dev
  }

  const rowsArray = [];
  const width = 15;
  const height = 15;
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

<<<<<<< HEAD
function calculateWinner(squares){
    return null;
=======
function calculateWinner(squares) {
  const width = 15;
  const height = 15;

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
  return;
>>>>>>> Dev
}