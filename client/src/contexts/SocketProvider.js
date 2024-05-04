import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const SocketContext = React.createContext()

export function useSocket() {
  return useContext(SocketContext)
}

// SocketProvider: 
// Allows client to connect with socket at localhost:9000, query: { id } is passed so the server can
// idenitfy and associate the WebSocket connection with a specific user id. This socket is set to the state
export function SocketProvider({ id, children }) {
  const [socket, setSocket] = useState()
  /* The useEffect() hook is used to establish a WebSocket connection with the server when the component is mounted.
     The WebSocket connection is established using the io() function from the socket.io-client library.
     The WebSocket connection is established with the server at http://localhost:9000.
     The id of the user is passed as a query parameter to the server so that the server can identify and associate the WebSocket connection with a specific user id.
     The WebSocket connection is stored in the state variable socket using the setSocket() function.
     The useEffect() hook returns a cleanup function that closes the WebSocket connection when the component is unmounted.
  */
  useEffect(() => {
    try{
      const newSocket = io('http://localhost:9000', 
        { query: { id }, withCredentials: true });
      setSocket(newSocket);
      return () => newSocket.close();
    }catch(error){
      alert(error)
    }
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}