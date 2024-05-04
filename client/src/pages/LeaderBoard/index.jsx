import React,{useState,useContext} from 'react';
import {PageContext} from '../../components/appPage/pageContext'
import "./index.css"
import Header from '../../components/Header/Header';

/* The LeaderBoardPage component is used to display the leaderboard
    The leaderboard data is stored in the page context
    The leaderboard data includes the name and the points of the users
    The user can click on the Add Friend button to add a friend
    The friends are stored in the friends state
*/
export default function LeaderBoardPage(){
    // Get the leaderboard data from the page context
    const {leaderBoardData} = useContext(PageContext);

    // State to store friend IDs
    const [friends, setFriends] = useState("");

    // Function to add a user as a friend
    const addFriend = userId => {
        setFriends(prevFriends => [...prevFriends, userId]);
    };

    // Function to handle friend (not implemented)
    function handleFriend () {
        console.log('test');
    }

    /* The return statement contains the JSX code to render the LeaderBoardPage component
        The component contains a header, a table to display the leaderboard data, and a button to add a friend
        The user can click on the Add Friend button to add a friend
        The friends are stored in the friends state
    */
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