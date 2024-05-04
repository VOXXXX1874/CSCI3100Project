import React, { useState, useEffect, useContext, useRef } from 'react';
import {useGameSocket} from '../../contexts/GameSocketProvider'
import { useConversations } from '../../contexts/ConversationsProvider';
import {Modal,Button} from 'react-bootstrap';
import {PageContext} from '../../components/appPage/pageContext'
import './game.css'
import OpenConversation from '../../components/OpenConversation';
import pingSound from './ping.mp3';
import endSound from './end.mp3';

/* The Square component is used to display a square on the board
    The square can be empty, black, or white
    The square can be clicked to place a stone
    The square can be hovered to show the hover effect
*/
function Square({value,onSquareClick,xIsNext,playerColor}){
  // State to store whether the square is hovered
  const [isHovered,setIsHovered] = useState(false);
  let SquaresMap = null

  // Functions to handle mouse enter and leave event
  const handleMouseEnter = ()=>{
    setIsHovered(true);
  }
  const handleMouseLeave = ()=>{
    setIsHovered(false);
  }

  // The SquaresMap object is used to map the value of the square to the corresponding JSX element
  // Be careful with the playerColor and xIsNext, they are not the same
  if(playerColor!==xIsNext){
    // If the player is the current player, the square is clickable
    // It is also possible to hover over the square
    SquaresMap = {
      null:<button className={`square ${isHovered ? 'hovered' : ''} ${xIsNext ? 'HX':'HO'}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={onSquareClick}></button>,
      "X": <button className="square X" onMouseLeave={handleMouseLeave}></button>,
      "O": <button className="square O" onMouseLeave={handleMouseLeave}></button>,
    }
  }
  else{
    // If the player is not the current player, the square is not clickable
    // It is also not possible to hover over the square
    SquaresMap = {
      null:<button className="square" onMouseLeave={handleMouseLeave}></button>,
      "X": <button className="square X" onMouseLeave={handleMouseLeave}></button>,
      "O": <button className="square O" onMouseLeave={handleMouseLeave}></button>,
    }
  } 
  return SquaresMap[value];
}
  
export default function Game({color,startTime}){
  // x stands for black and o stands for white
  const socket = useGameSocket()
  // Store the last retraction step to prevent multiple retraction requests
  const [lastRetraction,setLastRetraction] = useState(0)
  // xIsNext is used to determine the current player
  const [xIsNext,setXIsNext] = useState(true);
  // history is used to store the history of the game
  const [history,setHistory] = useState([Array(361).fill(null)]);
  // winner is used to store the winner of the game
  const [winner,setWinner] = useState(null)
  // Get the page context through useContext() function. The context is defined in pageContext.jsx
  const {id,returnToHome,match,setStates} = useContext(PageContext)
  // hasRetraction is used to store whether the player has raised a retraction request
  const [hasRetraction,setHasRetraction] = useState(false)
  // receiveRetraction is used to store whether the player has received a retraction request
  const [receiveRetraction, setReceiveRetraction] = useState(false)
  // currentMove is used to store the current move of the game
  const [currentMove,setCurrentMove] = useState(0);
  // currentSquares is used to store the current state of the game
  const currentSquares = history[currentMove];
  // Get the required functions from the conversations context for in-game chat
  const { createConversation, selectConversationIndex, returnConversationIndex } = useConversations()
  
  /* The useEffect() hook is used to listen for the 'handle-play' event
      The backend sends the 'handle-play' event when a player makes a move
      The function updates the history and the current move of the game
      The function also calculates the winner of the game
  */
  useEffect(() => {
    if (socket == null) return

    socket.on('handle-play', (place,player)=>{
      // Update the chessboard
      let nextSquares = history[currentMove].slice()
      nextSquares[place] = player? "O":"X"
      // Update the current player
      setXIsNext(player)
      // Update the history
      const nextHistory = [...history.slice(0,currentMove+1),nextSquares];
      setHistory(nextHistory)
      // Update the current move
      setCurrentMove(nextHistory.length-1)
      // Calculate the winner
      setWinner(calculateWinner(nextSquares))
    })

    return () => socket.off('handle-play')
  }, [socket,history,currentMove])

  /* The useEffect() hook is used to initialize the conversation
      The function creates a conversation with the opponent
      The function selects the conversation index
  */
  useEffect(() => {
    // Get the opponent's ID
    var opponent = null
    if (id === match.player1){
      opponent = match.player2
    }
    else{
      opponent = match.player1
    }
    console.log(opponent)
    // Create a conversation with the opponent
    createConversation([opponent])
    // Select the conversation index
    let conversationIndex = returnConversationIndex(opponent)
    console.log('conversation index: ', conversationIndex)
    selectConversationIndex(conversationIndex)
  }, [])

  /* Function to summary the game when there is a winner
      The function sets the states of the game
      The function emits the 'summary-game' event to the backend
      The function returns the user to the home page
  */
  function summaryGame(){
    setStates({waitingMatch:false,match:'',game:''})
    socket.emit('summary-game',winner)
    returnToHome()
  }

  /* Function to place a stone on the board
      The function checks if the square is empty
      The function checks if the player is the current player
      The function emits the 'place-stone' event to the backend
  */
  function placeStone(i){
    // xIsNext means black is next, in which player white color=true === xIsNext
    // If the square is not empty or the player is not the current player, return
    if(currentSquares[i]||color===xIsNext){
      return;
    }
    // Play the audio when placing a stone
    if (document.getElementById('audio')){
      document.getElementById('audio').play();
    }
    console.log("place stone", Math.floor(i/19), i%19)
    socket.emit('place-stone',i)
  }

  /* Function to raise a retraction request
      The function checks if the current move is less than or equal to 1
      The function checks if the last retraction is greater than or equal to the current move minus 2
      The function emits the 'retract-request' event to the backend
  */
  function retractRequest(){
    // If the current move is less than or equal to 1, return
    if (currentMove<=1){
      alert("You cannot retract now")
      return;
    }
    // If the last retraction is greater than or equal to the current move minus 2, return
    if (lastRetraction>=currentMove-2){
      alert("You cannot retract now")
      return;
    }
    // Set the last retraction to the current move plus 1 when raising a retraction request
    console.log("Retraction Request")
    setLastRetraction(currentMove+1)
    setHasRetraction(true)
    socket.emit('retract-request')
  }

  /* The useEffect() hook is used to listen for the 'handle-retract-request' event
      The backend sends the 'handle-retract-request' event when a player raises a retraction request
      The function sets the receive retraction state to true
  */
  useEffect(() => {
    if (socket == null) return

    socket.on('handle-retract-request', ()=>{
      setReceiveRetraction(true)
    })

    return () => socket.off('handle-retract-request')
  }, [socket])

  /* Function to confirm a retraction request
      The function emits the 'response-retract-request' event to the backend
  */
  function confirmRetractionRequest(){
    console.log("Retraction Request Confirmed")
    socket.emit('response-retract-request',true)
  }

  /* Function to refuse a retraction request
      The function emits the 'response-retract-request' event to the backend
  */
  function refuseRetractionRequest(){
    console.log("Retraction Request Refused")
    socket.emit('response-retract-request',false)
  }

  /* The useEffect() hook is used to listen for the 'end-retract-request' event
      The backend sends the 'end-retract-request' event when a player confirms or refuses a retraction request
      The function sets the has retraction and receive retraction states to false
      The function alerts the player whether the retraction is confirmed or refused
      The function updates the current move
  */
  useEffect(() => {
    if (socket == null) return

    socket.on('end-retract-request', (message)=>{
      // If the retraction is confirmed, alert the player and update the current move
      if(message){
        alert("The retraction is confirmed")
        const previousMove = currentMove-2
        setCurrentMove(previousMove)
      }
      else{ // If the retraction is refused, alert the player
        alert("The retraction is refused")
      }
      // Set the has retraction and receive retraction states to false to close the modal
      setHasRetraction(false)
      setReceiveRetraction(false)
    })

    return () => socket.off('end-retract-request')
  }, [socket,history,currentMove])

  let status = 'Current player: ' + (xIsNext ? 'Black':'White');

  /* The return statement contains the JSX code to render the Game component
      The component contains the game board, the in-game chat, game information, and the game end modal
      The player can retract a move, see the elapsed time, chat with the opponent, current player, and the game board
  */
  return(
    <div className='game'>
      <div className="status">
        {status}
        <div>
          <Button onClick={retractRequest} disabled={color===xIsNext}>Rectract</Button>
        </div>
        <div>
          The elapsed time is {getMinutesDifference(startTime,new Date()).toFixed(4)}
        </div>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} placeStone={placeStone} playerColor={color}/>
      </div>
      <div className='chat'>
        <div className='chatHeader'>In-Game Chat</div>
        <OpenConversation/>
      </div>
      <Modal show={winner}>
        <GameEndModal summaryGame={()=>summaryGame(winner)} winner={winner}/>
      </Modal>
      <Modal show={hasRetraction||receiveRetraction}>
        <RetractModal hasRetraction={hasRetraction} receiveRetraction={receiveRetraction} confirmRetractionRequest={confirmRetractionRequest} refuseRetractionRequest={refuseRetractionRequest}/>
      </Modal>
    </div>
  );
}

/* calculate the difference in minutes between two dates */
function getMinutesDifference(date1, date2) {
  let differenceInMilliseconds = Math.abs(date2 - date1);
  let differenceInMinutes = differenceInMilliseconds / (1000 * 60);
  return differenceInMinutes;
}

/* The Board component is used to display the game board
    The board contains 19 rows and 19 columns
    The board contains 361 squares
    The board contains the squares and the stones
*/
function Board({xIsNext,squares,placeStone,playerColor}) {
  // The rowsArray is used to store the rows of the board
  const rowsArray = [];
  // The width and height of the board
  const width =19;
  const height = 19;

  // Construct the board by a 1D array of buttonsArray
  for(let i = 0; i < height; i++){
    // Each buttons array is one row and contains 19 buttons
    const buttonsArray = [];
    for(let j = 0; j < width; j++){
      buttonsArray.push(
        <Square key = {`button-${j}`} value={squares[i*width+j]} onSquareClick={() => placeStone(i*width+j)} xIsNext={xIsNext} playerColor = {playerColor}/>
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
    <audio id="audio"><source src={pingSound} type="audio/mp3"></source></audio>
    <audio id="endAudio"><source src={endSound} type="audio/mp3"></source></audio>
    {rowsArray}
    </>
  );
}

/* The calculateWinner() function is used to calculate the winner of the game
    The function iterates over each cell of the board
    The function checks for winning sequences in all directions
    The function returns the player ID if a winning sequence is found
*/
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

/* The GameEndModal component is used to display the game end modal
    The modal displays the winner of the game
    The modal contains a button to summarize the game and return to the home page
*/
function GameEndModal({summaryGame, winner}) {
  if (document.getElementById('endAudio')){
    document.getElementById('endAudio').play();
  }
  // Display the winner of the game
  let winnerColor = null
  if(winner==="X"){
    winnerColor = "black"
  }
  else if(winner==="O"){
    winnerColor = "white"
  }
  return (
    <>
      <Modal.Header>The {winnerColor} side wins!</Modal.Header>
      <Modal.Body>
        <Button onClick={summaryGame}>Return to Home</Button>
      </Modal.Body>
    </>
  )
}

/* The RetractModal component is used to display the retract modal
    The modal displays the retract request
    The modal contains buttons to confirm or refuse the retract request
*/
function RetractModal({hasRetraction,receiveRetraction,confirmRetractionRequest,refuseRetractionRequest}) {
  // Raise a retract request
  if(hasRetraction){
    return (
      <>
        <Modal.Header>You raise a retract request</Modal.Header>
        <Modal.Body>
          Please waiting for another player's confimation...
        </Modal.Body>
      </>
    )
  }
  // Receive a retract request
  if(receiveRetraction){
    return(
      <>
        <Modal.Header>Receive opposite's retract request</Modal.Header>
        <Modal.Body>
          <Button onClick={confirmRetractionRequest}>Confirm</Button>
          <Button onClick={refuseRetractionRequest}>Refuse</Button>
        </Modal.Body>
      </>
    )
  }
}