import React,{useState} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"

/* The FriendsPage component is used to display the friends page
    *** It is not implemented yet ***
    The friends page contains a table to display the leaderboard data
    The leaderboard data includes the name and the points of the users
    The user can click on the Add Friend button to add a friend
    The friends are stored in the friends state
*/
export default function FriendsPage(){// Example leaderboard data
    const leaderboardData = [
        { id: 1, name: 'John', points: 100 },
        { id: 2, name: 'Alice', points: 85 },
        { id: 3, name: 'Bob', points: 75 },
        { id: 4, name: 'Jane', points: 60 },
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