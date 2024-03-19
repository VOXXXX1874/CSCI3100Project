import React, {useState} from 'react'
import './game.css'

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
  
export default function Game(){
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
  const winner = calculateWinner(currentSquares);
  let status;
  if(winner){
    status = 'Winner: ' + winner;
  }else{
    status = 'Next player: ' + (xIsNext ? 'X':'O');
  }
  return(
    <div className='game'>
      <div className="status">{status}</div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

function calculateWinner(squares){
    return null;
}