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
  // Vox: Except for the id, I also let the socket send the session of this user.
  // Session is obtained after login, so only after login the socket can be created.
  // What's more, the backend can compare the id and res.session.username to ensure security
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