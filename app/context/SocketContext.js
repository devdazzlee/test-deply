"use client";

import { isLoggedIn } from "@/utils";
import { createContext, useEffect, useState } from "react";

export const SocketContext = createContext();

export default function SocketState({ children }) {
  const [socketInstance, setSocketInstance] = useState(null);

  return (
    <SocketContext.Provider value={{ socketInstance }}>
      {children}
    </SocketContext.Provider>
  );
}
