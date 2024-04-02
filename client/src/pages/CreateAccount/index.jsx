import React,{useContext} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"

export default function CreateAccountPage(){
    const {logout, startGame, modifySettings} = useContext(PageContext);
    // When the button is clicked, corresponding function will be called and page context is changed to jump to another state
    function handleStartGame(){
        startGame();
    }
    return(
        <div className="CreateAccountPage">
            <h2>This is Home page</h2>
            <div className="ButtonsContainer">
                <button className="PageButton" onClick={handleStartGame}>Game</button>
            </div>
        </div>
        
    );
}