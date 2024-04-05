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

  useEffect(() => {
    const newSocket = io('http://localhost:9000', { query: { id } });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [id]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}