import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import settingIcon from './settingIcon.png'
import userIcon from './user.png'
import homeIcon from './home.png'
import { PageContext } from '../appPage/pageContext';
import React, { useContext, useState } from 'react';

/* The Header component is used to display the header of the page
    The header contains the user icon, the settings icon, and the home icon
    The user can click on the settings icon to change the font size, manage the profile, or logout
    The user can click on the home icon to return to the home page
*/
export default function Header() {
    const { returnToSignIn, page } = useContext(PageContext);
    const [fontSize, setFontSize] = useState(16);
    const { manageProfile } = useContext(PageContext);
    const { returnToHome } = useContext(PageContext)

    function handleReturnToSignIn() {
        if(page === 2){
            alert("Please respect the game and finish it first!")
            return;
        }
        returnToSignIn();
    }

    function handleFontSizeChange(event) {
        if (page === 2){
            return;
        }
        setFontSize(parseInt(event.target.value));
    }

    function handleManageProfile() {
        if(page === 2){
            alert("Please respect the game and finish it first!")
            return;
        }
        manageProfile();
    }

    function handleReturnToHome(){
        if(page === 2){
            alert("Please respect the game and finish it first!")
            return;
        }
        returnToHome();
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary box" style={{ position: 'fixed', top: 0, left: 0, width: '100%' }}>
            <Container>
            <Navbar.Brand href="#home" className="me-auto">
            <img src={userIcon} alt="User Icon" style={{ width: '30px', height: '30px' }} />
            </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto" >
                        <NavDropdown title={<img src={settingIcon} alt="Settings" style={{ width: '30px', height: '30px' }} />} id="basic-nav-dropdown" 
                        className="custom-dropdown" style={{ width: '80px', marginRight: '10px' }} >
                            <NavDropdown.Item style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '10px' }}>Font Size</span>
                            <input 
                                type="range" 
                                min="10" 
                                max="40" 
                                value={fontSize} 
                                onChange={handleFontSizeChange} 
                                style={{ width: '50px' }}
                            />
                        </NavDropdown.Item>

                            <NavDropdown.Item href="#action" onClick={handleManageProfile}>
                                Manage Profile</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action" onClick={handleReturnToSignIn}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Brand href="#home" className="me-auto">
                <img src={homeIcon} alt="Home Icon" onClick={handleReturnToHome} style={{ width: '30px', height: '25px' }} />
            </Navbar.Brand>
            </Container>
            <style>{`
                body {
                    font-size: ${fontSize}px;
                }
            `}</style>
        </Navbar>
    );
}
