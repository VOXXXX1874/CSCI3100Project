import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const GameSocketContext = React.createContext()

export function useGameSocket() {
  return useContext(GameSocketContext)
}

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