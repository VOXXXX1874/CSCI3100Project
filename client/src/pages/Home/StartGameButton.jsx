import React,{useState,useEffect,useContext} from 'react';
import { useMatchSocket} from '../../contexts/MatchSocketProvider'
import {Modal,Button} from 'react-bootstrap';
import startGameImage from './startGame.png';
import {PageContext} from '../../components/appPage/pageContext'

/* The StartGameButton component is used to display the start game button
    The start game button is used to start a game by being matched with another player
    All the match logic is handled in this component
    When the user clicks on the start game button, the user will be matched with another player
    The user can also play with a machine player
*/
export default function StartGameButton({startGame}){
    // Get the page context through useContext() function. The context is defined in pageContext.jsx
    const {id,states,setStates} = useContext(PageContext)
    // The modalOpen state is used to control the visibility of the modal
    const [modalOpen, setModalOpen] = useState(false)
    // The findMatch state is used to check if the user has found a match
    const [findMatch,setFindMatch] = useState(false)
    // The match state is used to store the match data
    const [match,setMatch] = useState({})
    // The hasConfirm state is used to check if the user has confirmed the match
    const [hasConfirm,setHasConfirm] = useState(false)
    // Get the match socket through useMatchSocket() hook
    const socket = useMatchSocket()

    /* The useEffect() hook is used to run the code when the component mounts
        The code checks if the user is waiting for a match when user refreshes the page
        If the user is waiting for a match, the modal will be opened
        If the user is matched with another player, the modal will be opened
    */
    useEffect(() => {
      // Check if the user is waiting for a match. (match !== '' and waitingMatch === true) always false 
      if(states.waitingMatch === true){
        // If the user is waiting for a match, set the modalOpen state to true and the later match state to false
        setModalOpen(true)
        setFindMatch(false)
        setMatch({})
        setHasConfirm(false)
      }
      if (states.match !== '' && states.waitingMatch === false){// Check if the user is matched with another player
        // If the user is matched with another player, set the modalOpen state to true and the later match state to true
        // Whether the user has confirmed the match does not matter, user can confirm again or refuse
        setModalOpen(true)
        setFindMatch(true)
        // Split the match data into two parts: player1 and player2 and store them in the match state
        const parts = states.match.split('vs')
        setMatch({player1:parts[0],player2:parts[1]})
      }
    },[]);

    /* The handleStartGame function is used to handle the click event of the start game button
        The function sets the waitingMatch state to true and the match state to an empty string
        The function emits a 'begin-match' event to the server to start a match
    */
    function handleStartGame(){
      setStates({waitingMatch:true,match:'',game:''})
      setModalOpen(true)
      socket.emit('begin-match')
    }

    /* The cancelMatch function is used to cancel the match
        The function sets the waitingMatch state to false, the match state to an empty string, and the game state to an empty string
        The function emits a 'cancel-match' event to the server to cancel the match
    */
    function cancelMatch(){
      setStates({waitingMatch:false,match:'',game:''})
      setModalOpen(false)
      socket.emit('cancel-match')
    }

    /* The playWithMachine function is used to play with a machine player
        The function sets the waitingMatch state to false, the match state to an empty string, and the game state to the user ID and 'vs' and 'machine'
        The function emits a 'play-with-machine' event to the server to play with a machine player
    */
    function playWithMachine(){
      setStates({waitingMatch:false,match:'',game:id+'vs'+'machine'})
      socket.emit('play-with-machine')
      setModalOpen(false)
      startGame(false,{player1:'You',player2:'Machine'})
      alert("Enjoy your game with a random machine!")
    }

    /* The useEffect() hook is used to run the code when the component mounts
        The code listens for the 'find-match' event from the server
        If the server emits the 'find-match' event, the user is matched with another player
        The user can confirm or refuse the match
    */
    useEffect(() => {
      if (socket == null) return
  
      socket.on('find-match', (match)=>{
        setStates({waitingMatch:false,match:match.player1+'vs'+match.player2,game:''})
        setFindMatch(true)
        setMatch(match)
      })
  
      return () => socket.off('find-match')
    }, [socket])

    /* The confirmMatch function is used to confirm the match
        The function sets the hasConfirm state to true and emits a 'player-confirm' event to the server
    */
    function confirmMatch(){
      setHasConfirm(true)
      socket.emit('player-confirm',{match})
    }

    /* The refuseMatch function is used to refuse the match
        The function sets the waitingMatch state to false, the match state to an empty string, and the game state to an empty string
        The match will end and all modal will be closed after the user refuses the match
        The function emits a 'player-refuse' event to the server to refuse the match
    */
    function refuseMatch(){
      setStates({waitingMatch:false,match:'',game:''})
      setModalOpen(false)
      setFindMatch(false)
      setMatch({})
      setHasConfirm(false)
      socket.emit('player-refuse',{match})
      alert("You refuse the match")
    }

    /* The useEffect() hook is used to run the code when the component mounts
        The code listens for the 'receive-match-result' event from the server
        If the server emits the 'receive-match-result' event, the user will receive the match result
        The result contains the message and the match data
    */
    useEffect(() => {
      if (socket == null) return
  
      socket.on('receive-match-result', (message,result)=>{
        // After the user receives the match result, all the modals can be closed
        setModalOpen(false)
        setFindMatch(false)
        setHasConfirm(false)
        // If the message is 'refuse', the user will be informed that another player has refused the match
        // This player will return to the queue
        if(message==='refuse'){
          setStates({waitingMatch:true,match:'',game:''})
          setModalOpen(true)
          alert("Another player has refused the match. Return to queue")
        }// If the message is 'accept-white', the user will be informed that both players have confirmed the match
        else if(message==='accept-white'){// And this player will play as white
          setStates({waitingMatch:false,match:'',game:match.player1+'vs'+match.player2})
          startGame(true,result)
          alert("Both players have confirmed! Game start!")
        } // If the message is 'accept-black', the user will be informed that both players have confirmed the match
        else if(message==='accept-black'){ // And this player will play as black
          setStates({waitingMatch:false,match:'',game:match.player1+'vs'+match.player2})
          startGame(false,result)
          alert("Both players have confirmed! Game start!")
        }
        setMatch({})
      })
  
      return () => socket.off('receive-match-result')
    }, [socket,startGame])

    /* The return statement contains the JSX code to render the StartGameButton component
    */
    return (
      <div>
        <button className="PageButton" onClick={handleStartGame}>
          <div className="ButtonContent">
          <img src={startGameImage} alt="Start Game" style={{ width: '20vw', height: '260px' }} />
            <div className="ButtonText">Start Game</div>
          </div>
        </button>
        <Modal show={modalOpen}>
          {!findMatch?
          <StartGameModal cancelMatch={cancelMatch} playWithMachine={playWithMachine}/>:
          <ConfirmMatchModal match = {match} confirmMatch = {confirmMatch} refuseMatch = {refuseMatch} hasConfirm={hasConfirm}/>}
        </Modal>
      </div>
    )
  }

  /* The StartGameModal component is used to display the start game modal
    The start game modal is used to inform the user that the system is looking for another player
    The user can cancel the match or play with a machine player
  */
  function StartGameModal({cancelMatch, playWithMachine}) {
    return (
      <>
        <Modal.Header closeButton>Please be patient, we are looking for another player...</Modal.Header>
        <Modal.Body>
          <Button onClick={cancelMatch}>Cancel Match</Button>
          <Button onClick={playWithMachine}>Play with machine player</Button>
        </Modal.Body>
      </>
    )
  }

  /* The ConfirmMatchModal component is used to display the confirm match modal
    The confirm match modal provides interface for the user to confirm or refuse the match
  */
function ConfirmMatchModal({match,confirmMatch,refuseMatch, hasConfirm}){
    return(
      <>
        <Modal.Header>Find another player! {match.player1} vs {match.player2}</Modal.Header>
        <Modal.Body>
          {hasConfirm?
          <ConfirmMessage/>:
          <MatchButtons confirmMatch={confirmMatch} refuseMatch={refuseMatch}/>
          }
        </Modal.Body>
      </>
    )
}

/* The MatchButtons component is used to display the confirm and refuse buttons
    The user can confirm or refuse the match
*/
function MatchButtons({confirmMatch,refuseMatch}){
  return(
    <>
      <Button onClick={confirmMatch}>Confirm this Match</Button>
      <Button onClick={refuseMatch}>Refuse this Match</Button>
    </>
  )
}

/* The ConfirmMessage component is used to display the message after the user confirms the match
    The user will be informed that the match is confirmed and the system is waiting for another player's confirmation
*/
function ConfirmMessage(){
  return(
    <>
      You have confirmed the match. Waiting for another player's confirmation.
    </>
  )
}