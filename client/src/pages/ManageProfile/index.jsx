import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'; 
import Header from '../../components/Header/Header';
import Button from 'react-bootstrap/Button';
import usernameIcon from './username.png'
import passwordIcon from './password.png'
import './index.css'

export default function ManageProfilePage(){
    return (
        <Router>
            <div className="ManageProfilePage">
                <Header />
                <h1>Profile</h1>
                <div className="button-container">
                    <Button variant="light">
                        <img src={usernameIcon} style={{ width: '20px', height: '20px' }} /> Change username
                    </Button>
                    <Button variant="light">
                        <img src={passwordIcon} style={{ width: '20px', height: '20px' }} /> Change password
                    </Button>
                </div>
            </div>
        </Router>
    );
    
}

