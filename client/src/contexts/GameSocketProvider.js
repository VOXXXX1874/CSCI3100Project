import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const GameSocketContext = React.createContext()

export function useGameSocket() {
  return useContext(GameSocketContext)
}

/* The GameSocketProvider component is used to establish a WebSocket connection with the server.
    The component takes the game id as a prop and establishes a WebSocket connection with the server at http://localhost:9000.
    The game id is passed as a query parameter to the server so that the server can identify and associate the WebSocket connection with a specific game id.
    The WebSocket connection is stored in the state variable socket using the setSocket() function.
    The GameSocketProvider component returns the GameSocketContext.Provider component with the value set to the WebSocket connection.
    The children of the GameSocketProvider component are the components that will have access to the WebSocket connection.
*/
export function GameSocketProvider({ id, children }) {
  const [socket, setSocket] = useState()

  useEffect(() => {
    try{
      const newSocket = io('http://localhost:9000', 
        { path: "/Game/", query: { id }, withCredentials: true});
      setSocket(newSocket);
      return () => newSocket.close();
    }catch(error){
      alert(error)
    }
  }, [id]);

  return (
    <GameSocketContext.Provider value={socket}>
      {children}
    </GameSocketContext.Provider>
  )
}