import React from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom'; 
import Header from '../../components/Header/Header';
import Button from 'react-bootstrap/Button';
import usernameIcon from './username.png'
import passwordIcon from './password.png'
import './index.css'
import LeaderBoardPage from '../LeaderBoard';
import Table from 'react-bootstrap/Table';

/* The ManageProfilePage component is used to display the profile of the user
    The profile includes the username and the friends of the user
    The user can change the username and the password
    The user can also see the friends of the user
*/
export default function ManageProfilePage(){
    /* The return statement contains the JSX code to render the ManageProfilePage component
        The component contains a header, a button to change the username, a button to change the password, and a table to display the friends of the user
        Due to limitation of time, the functionality of changing the username and the password is not implemented
        It is a static page that only displays the profile of the user
    */
    return (
        <Router>
            <div className="ManageProfilePage">
                <Header />
                <h2>Profile</h2>
                <div className="button-container">
                <Button variant="light">
                    <img src={usernameIcon} style={{ width: '20px', height: '20px' }} /> Change username
                </Button>
                <Button variant="light">
                    <img src={passwordIcon} style={{ width: '20px', height: '20px' }} /> Change password
                </Button>
                <p></p>
                <h2>Friends</h2>
                <div className="table-container">
                    <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>#</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>1</td>
                        <td>Kevin</td>
                        <td>Otto</td>
                        <td>@kotto</td>
                        </tr>
                        <tr>
                        <td>2</td>
                        <td>Alice</td>
                        <td>Thornton</td>
                        <td>@alicet</td>
                        </tr>
                        <tr>
                        <td>3</td>
                        <td>Lee</td>
                        <td>Wang</td>
                        <td>@wang23</td>
                        </tr>
                        <tr>
                        <td>4</td>
                        <td>Mandy</td>
                        <td>Chan</td>
                        <td>@mandychan</td>
                        </tr>
                    </tbody>
                    </Table>
                    
                </div>
                </div>
            </div>
        </Router>
    );
    
}

