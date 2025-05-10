import { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";
import {API_BASE_URL } from "./config.js"
const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () => 
      io(`${API_BASE_URL}`, {
        withCredentials: true,
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider };
