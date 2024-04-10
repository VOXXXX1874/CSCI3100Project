import { useState } from 'react';
import React from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"

export default function SettingsPage(){

    const SettingsPage = () => {
        // State variables to track mute status and font size
        const [isMuted, setIsMuted] = useState(false);
        const [fontSize, setFontSize] = useState(16); // Initial font size of 16px
    
        // Function to toggle mute/unmute
        const toggleMute = () => {
            setIsMuted(prevState => !prevState);
        };
    
        // Function to handle font size change
        const handleFontSizeChange = event => {
            setFontSize(parseInt(event.target.value));
        };
    
        // Function to redirect to manage profile page
        const redirectToProfilePage = () => {
            // Replace '/manage-profile' with the actual route to manage profile page
            window.location.href = '/manage-profile';
        };
    
        return (
            <div>
                <h1>Settings</h1>
                <div>
                    <h2>Mute/Unmute</h2>
                    <button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</button>
                </div>
                <div>
                    <h2>Font Size</h2>
                    <input
                        type="range"
                        min="12"
                        max="24"
                        step="1"
                        value={fontSize}
                        onChange={handleFontSizeChange}
                    />
                    <span>{fontSize}px</span>
                </div>
                <div>
                    <h2>Manage Profile</h2>
                    <button onClick={redirectToProfilePage}>Go to Profile</button>
                </div>
            </div>
        );
    };
}