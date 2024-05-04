import React,{useContext, useState} from 'react';
import "./index.css";
import { ListGroup, Modal, Button } from 'react-bootstrap';
import { PageContext } from '../../components/appPage/pageContext';
import Header from '../../components/Header/Header'; 

/* The PastGamesPage component is used to display the past games of the user
    The past games are stored in the pastGames array in the page context
    The past games are displayed in a list group
    When the user clicks on a past game, a modal will pop up to show the details of the game
    The details include the players, the winner, the start time, the elapsed time, and the final board
*/
export default function PastGamesPage(){
    // Get the page context through useContext() function. The context is defined in pageContext.jsx
    const {id, pastGames } = useContext(PageContext);
    // The show state is used to control the visibility of the modal
    const [show, setShow] = useState(false);
    // The modalData state is used to store the data of the game that the user clicked on
    const [modalData, setModalData] = useState({});
    // The handleClose function is used to close the modal
    const handleClose = () => setShow(false);

    // The handleShow function is used to show the modal and set the modalData
    const handleShow = (game) => () => {
        setShow(true);
        setModalData(game);   
    };
        
    // The renderListGroups function is used to render the list group of past games
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

    // The Board component is used to display the final board of the game
    function Board({squares}) {
        // The size of board is 19*19
        const rowsArray = [];
        const width =19;
        const height = 19;
        // The board is constructed by a 1D array of buttonsArray
        for(let i = 0; i < height; i++){
          const buttonsArray = [];
          // Each buttons array is one row and contains 19 buttons
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
    
      // The Square component is used to display the tiles on the board
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
                    <p>
                        Elapsed time: {(modalData.elapsedTime)}
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


