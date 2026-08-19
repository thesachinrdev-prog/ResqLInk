import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../services/socket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [isConnected, setIsConnected] = useState(true);
  const [lastEvent, setLastEvent] = useState(null);

  useEffect(() => {
    // Listen to all socket broadcasts
    const unsub = socket.on('*', ({ eventName, payload }) => {
      setLastEvent({ eventName, payload, timestamp: Date.now() });
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        lastEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return ctx;
}
