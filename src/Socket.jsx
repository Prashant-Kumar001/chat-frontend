import { createContext, useMemo, useContext } from "react";
import { io } from "socket.io-client";
import { API_BASE_URL } from "./config";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(
    () =>
      io("https://chat-backend-lffn.onrender.com", {
        withCredentials: true,
      }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider };
