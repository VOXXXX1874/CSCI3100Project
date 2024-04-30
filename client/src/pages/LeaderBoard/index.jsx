import React,{useState} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"
import Header from '../../components/Header/Header';

export default function LeaderBoardPage(){// Example leaderboard data
    const leaderboardData = [
        { id: 1, name: 'Voxx', points: 3 },
        { id: 2, name: 'Vox', points: 2 },
        { id: 3, name: 'Lana', points: 1 },
        { id: 4, name: 'Voxxx', points: 1 },
    ];

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
                    {leaderboardData.map(user => (
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