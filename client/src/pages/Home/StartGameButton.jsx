import React,{useState} from 'react';
import { useMatchSocket} from '../../contexts/MatchSocketProvider'
import StartGameModal from '../../components/StartGameModal'
import {Modal} from 'react-bootstrap';
import startGameImage from './startGame.png';

export default function StartGameButton(startGame){
    const [modalOpen, setModalOpen] = useState(false)
    const socket = useMatchSocket()
    function handleStartGame(){
      setModalOpen(true)
      socket.emit('begin-match', { data: 'beginMatch'})
      //startGame()
    }
    function closeModal(){
      setModalOpen(false)
    }
    return (
      <div>
        <button className="PageButton" onClick={handleStartGame}>
          <div className="ButtonContent">
          <img src={startGameImage} alt="Start Game" style={{ width: '20vw', height: '260px' }} />
            <div className="ButtonText">Start Game</div>
          </div>
        </button>
        <Modal show={modalOpen} onHide={closeModal}>
            <StartGameModal closeModal={closeModal}/>
        </Modal>
      </div>
    )
  }