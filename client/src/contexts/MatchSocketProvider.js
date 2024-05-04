import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const MatchSocketContext = React.createContext()

/* The useMatchSocket() function is a custom hook that returns the WebSocket connection from the MatchSocketContext.
    The useContext() hook is used to access the WebSocket connection from the MatchSocketContext.
    The useMatchSocket() function returns the WebSocket connection.
*/
export function useMatchSocket() {
  return useContext(MatchSocketContext)
}

/* The MatchSocketProvider component is used to establish a WebSocket connection with the server.
    The component takes the user id as a prop and establishes a WebSocket connection with the server at http://localhost:9000.
    The user id is passed as a query parameter to the server so that the server can identify and associate the WebSocket connection with a specific user id.
    The WebSocket connection is stored in the state variable socket using the setSocket() function.
    The MatchSocketProvider component returns the MatchSocketContext.Provider component with the value set to the WebSocket connection.
    The children of the MatchSocketProvider component are the components that will have access to the WebSocket connection.
*/
export function MatchSocketProvider({ id, children }) {
  const [socket, setSocket] = useState()

  useEffect(() => {
    try{
      const newSocket = io('http://localhost:9000', 
        { path: "/Match/", query: { id }, withCredentials: true });
      setSocket(newSocket);
      return () => newSocket.close();
    }catch(error){
      alert(error)
    }
  }, [id]);

  return (
    <MatchSocketContext.Provider value={socket}>
      {children}
    </MatchSocketContext.Provider>
  )
}