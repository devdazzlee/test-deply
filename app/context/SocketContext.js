"use client";

import { useSession } from "next-auth/react";
import { createContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export const SocketContext = createContext();

let socket;

export default function SocketState({ children, currentUser }) {
  const [socketInstance, setSocketInstance] = useState(null);
  const [unreadRooms, setUnreadRooms] = useState(0);

  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && currentUser) {
      socket = io({
        query: {
          userId: currentUser.id
        }
      });

      setSocketInstance(socket);

      return () => {
        socket.disconnect();
      };
    }
  }, [status]);

  return (
    <SocketContext.Provider
      value={{ socketInstance, setUnreadRooms, unreadRooms, setSocketInstance }}
    >
      {children}
    </SocketContext.Provider>
  );
}
