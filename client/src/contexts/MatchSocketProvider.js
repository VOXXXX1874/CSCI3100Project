import React, { useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'

const MatchSocketContext = React.createContext()

export function useMatchSocket() {
  return useContext(MatchSocketContext)
}


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