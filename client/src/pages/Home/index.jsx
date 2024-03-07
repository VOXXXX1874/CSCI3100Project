import React,{useContext} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"

export default function HomePage(){
    const {logout, startGame, modifySettings} = useContext(PageContext);
    function handleStartGame(){
        startGame();
    }
    function handleSettings(){
        modifySettings();
    }
    function handleLogout(){
        logout();
    }
    return(
        <div className="HomePage">
            <h2>This is Home page</h2>
            <div className="ButtonsContainer">
                <button className="PageButton" onClick={handleStartGame}>Game</button>
                <button className="PageButton" onClick={handleSettings}>Settings</button>
                <button className="PageButton" onClick={handleLogout}>Logout</button>
            </div>
        </div>
        
    );
}