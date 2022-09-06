import { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

export const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketWrapper = ({ children }) => {
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const _socket = io("http://localhost:5001");
    setSocket(_socket);
    return () => _socket.close();
    //TODO: review this dependency ???
  }, [setSocket]);
  return (
    <SocketContext.Provider value={{ socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
