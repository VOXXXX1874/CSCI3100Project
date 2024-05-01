import React,{useState,useContext} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"
import Header from '../../components/Header/Header';

export default function LeaderBoardPage(){
    // Get the leaderboard data from the page context
    const {leaderBoardData} = useContext(PageContext);

    // State to store friend IDs
    const [friends, setFriends] = useState("");

    // Function to add a user as a friend
    const addFriend = userId => {
        setFriends(prevFriends => [...prevFriends, userId]);
    };

    function handleFriend () {
        console.log('test');
    }

    return (
        <div className="table-container"> {/* Add this wrapper */}
        <Header/>
            <h1>Leaderboard</h1><p></p>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Points</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderBoardData.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.points}</td>
                            <td>
                                <button onClick={() => addFriend(user.id)}>
                                    Add Friend
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}