import React,{useState,useEffect,useContext} from 'react';
import { useMatchSocket} from '../../contexts/MatchSocketProvider'
import {Modal,Button} from 'react-bootstrap';
import startGameImage from './startGame.png';
import {PageContext} from '../../components/appPage/pageContext'

export default function StartGameButton({startGame}){
    const {id,states,setStates} = useContext(PageContext)
    const [modalOpen, setModalOpen] = useState(false)
    const [findMatch,setFindMatch] = useState(false)
    const [match,setMatch] = useState({})
    const [hasConfirm,setHasConfirm] = useState(false)
    const socket = useMatchSocket()

    useEffect(() => {
      if(states.waitingMatch === true){
        setModalOpen(true)
        setFindMatch(false)
        setMatch({})
        setHasConfirm(false)
      }
      if (states.match !== '' && states.waitingMatch === false){
        setModalOpen(true)
        setFindMatch(true)
        const parts = states.match.split('vs')
        setMatch({player1:parts[0],player2:parts[1]})
      }
    },[]);

    function handleStartGame(){
      setStates({waitingMatch:true,match:'',game:''})
      setModalOpen(true)
      socket.emit('begin-match')
    }

    function cancelMatch(){
      setStates({waitingMatch:false,match:'',game:''})
      setModalOpen(false)
      socket.emit('cancel-match')
    }

    function playWithMachine(){
      setStates({waitingMatch:false,match:'',game:id+'vs'+'machine'})
      socket.emit('play-with-machine')
      setModalOpen(false)
      startGame(false,{player1:'You',player2:'Machine'})
      alert("Enjoy your game with a random machine!")
    }

    useEffect(() => {
      if (socket == null) return
  
      socket.on('find-match', (match)=>{
        setStates({waitingMatch:false,match:match.player1+'vs'+match.player2,game:''})
        setFindMatch(true)
        setMatch(match)
      })
  
      return () => socket.off('find-match')
    }, [socket])

    function confirmMatch(){
      setHasConfirm(true)
      socket.emit('player-confirm',{match})
    }

    function refuseMatch(){
      setStates({waitingMatch:false,match:'',game:''})
      setModalOpen(false)
      setFindMatch(false)
      setMatch({})
      setHasConfirm(false)
      socket.emit('player-refuse',{match})
      alert("You refuse the match")
    }

    useEffect(() => {
      if (socket == null) return
  
      socket.on('receive-match-result', (message,result)=>{
        setModalOpen(false)
        setFindMatch(false)
        setHasConfirm(false)
        if(message==='refuse'){
          setStates({waitingMatch:true,match:'',game:''})
          setModalOpen(true)
          alert("Another player has refused the match. Return to queue")
        }
        else if(message==='accept-white'){
          setStates({waitingMatch:false,match:'',game:match.player1+'vs'+match.player2})
          startGame(true,result)
          alert("Both players have confirmed! Game start!")
        }
        else if(message==='accept-black'){
          setStates({waitingMatch:false,match:'',game:match.player1+'vs'+match.player2})
          startGame(false,result)
          alert("Both players have confirmed! Game start!")
        }
        setMatch({})
      })
  
      return () => socket.off('receive-match-result')
    }, [socket,startGame])

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

function MatchButtons({confirmMatch,refuseMatch}){
  return(
    <>
      <Button onClick={confirmMatch}>Confirm this Match</Button>
      <Button onClick={refuseMatch}>Refuse this Match</Button>
    </>
  )
}

function ConfirmMessage(){
  return(
    <>
      You have confirmed the match. Waiting for another player's confirmation.
    </>
  )
}