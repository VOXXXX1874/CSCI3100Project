import React,{useState,useEffect} from 'react';
import { useMatchSocket} from '../../contexts/MatchSocketProvider'
import {Modal,Button} from 'react-bootstrap';
import startGameImage from './startGame.png';

export default function StartGameButton({startGame}){
    const [modalOpen, setModalOpen] = useState(false)
    const [findMatch,setFindMatch] = useState(false)
    const [match,setMatch] = useState({})
    const [hasConfirm,setHasConfirm] = useState(false)
    const socket = useMatchSocket()
    function handleStartGame(){
      setModalOpen(true)
      socket.emit('begin-match')
    }

    function cancelMatch(){
      setModalOpen(false)
      socket.emit('cancel-match')
    }

    useEffect(() => {
      if (socket == null) return
  
      socket.on('find-match', (match)=>{
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
      setModalOpen(false)
      setFindMatch(false)
      setMatch({})
      setHasConfirm(false)
      socket.emit('player-refuse',{match})
      alert("You refuse the match")
    }

    useEffect(() => {
      if (socket == null) return
  
      socket.on('receive-match-result', (message)=>{
        setModalOpen(false)
        setFindMatch(false)
        setMatch({})
        setHasConfirm(false)
        if(message==='refuse'){
          setModalOpen(true)
          alert("Another player refuse the match. Now you return to waiting queue")
        }
        else if(message==='accept-white'){
          startGame(true)
          alert("Both players confirm! Game start!")
        }
        else if(message==='accept-black'){
          startGame(false)
          alert("Both players confirm! Game start!")
        }
      })
  
      return () => socket.off('find-match')
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
          <StartGameModal cancelMatch={cancelMatch}/>:
          <ConfirmMatchModal match = {match} confirmMatch = {confirmMatch} refuseMatch = {refuseMatch} hasConfirm={hasConfirm}/>}
        </Modal>
      </div>
    )
  }

  function StartGameModal({cancelMatch}) {
    return (
      <>
        <Modal.Header closeButton>Please be patient, we are looking for another player...</Modal.Header>
        <Modal.Body>
          <Button onClick={cancelMatch}>Cancel Match</Button>
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