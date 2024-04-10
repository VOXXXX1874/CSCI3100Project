import React,{useContext, useState} from 'react';
import "./index.css";
import { ListGroup, Modal, Button } from 'react-bootstrap';
import { PageContext } from '../../components/appPage/pageContext';
import Header from '../../components/Header/Header'; 

export default function PastGamesPage(){// Example leaderboard data
    const {id, pastGames } = useContext(PageContext);
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState({});

    const handleClose = () => setShow(false);

    const handleShow = (game) => () => {
        setShow(true);
        setModalData(game);   
    };
        

    const renderListGroups = () => {
        if (pastGames.length > 0) {
            return (
                <ListGroup>
                {pastGames.map((game, index) => (
                    <ListGroup.Item key={index} onClick={handleShow(game)}>{game.playerBlack} vs {game.playerWhite} (Game ID: {game.gameId})</ListGroup.Item>
                ))}
                </ListGroup>
            );
            } else {
            return <p>No games to display.</p>;
            }
    };

    function Board({squares}) {
        const rowsArray = [];
        const width =19;
        const height = 19;
        for(let i = 0; i < height; i++){
          const buttonsArray = [];
          for(let j = 0; j < width; j++){
            buttonsArray.push(
              <Square key = {`button-${j}`} value={squares[i*width+j]} />
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
    

      function Square({value}){
        let SquaresMap = null
      
        SquaresMap = {
        null:<button className="square"></button>,
        "X": <button className="square X" ></button>,
        "O": <button className="square O"></button>,
        }

        return SquaresMap[value];
      }

    return (
        <div className="PastGamesPage">
        <Header></Header>
        <div className="title">
            <h1>Past Games: {id}</h1>
        </div>
        {renderListGroups()}
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>{modalData.playerBlack} vs {modalData.playerWhite}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                        {modalData.winner === 'playerBlack' && <h4>Winner: {modalData.playerBlack} (Black tiles)</h4>}
                        {modalData.winner === 'playerWhite' && <h4>Winner: {modalData.playerWhite} (White tiles)</h4>}               
                </div>
                <div className = "board">
                    <Board squares={modalData.finalGoBoard}/>
                </div>
                <div className = "content">
                    <p>
                        Start time: {(new Date(modalData.startTime)).toLocaleString()}
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </div>
    );
    };      


