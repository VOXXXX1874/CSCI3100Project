import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import settingIcon from './settingIcon.png'
import userIcon from './user.png'
import homeIcon from './home.png'
import { PageContext } from '../appPage/pageContext';
import React, { useContext, useState } from 'react';

export default function Header() {
    const { returnToSignIn } = useContext(PageContext);
    const [fontSize, setFontSize] = useState(16);
    const { manageProfile } = useContext(PageContext);
    const { returnToHome } = useContext(PageContext)

    function handleReturnToSignIn() {
        returnToSignIn();
    }

    function handleFontSizeChange(event) {
        setFontSize(parseInt(event.target.value));
    }

    function handleManageProfile() {
        manageProfile();
    }

    function handleReturnToHome(){
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
                            <NavDropdown.Item href="#action">Sound</NavDropdown.Item>
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
