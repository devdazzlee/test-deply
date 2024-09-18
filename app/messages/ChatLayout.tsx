"use client";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import SearchComponent from "./SearchComponent";
import ContactsComponent from "./ContactsComponent";
import MessageBoxComponent from "./MessageBoxComponent";
import io, { Socket } from "socket.io-client";

let socket: Socket;

const ChatLayout: React.FC = ({ currentUser }: { currentUser: any }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    console.log({ currentUser });
    // Connect to Socket.IO server
    socket = io();

    // Cleanup the socket when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className='flex flex-col sm:flex-row mt-10 sm:-mt-6 h-[82vh] sm:h-[90vh] bg-white'>
      {/* Mobile menu button */}
      <button
        className={`sm:hidden fixed ${
          isSidebarOpen ? "top-2" : "top-[10.5rem]"
        } right-4 z-50 p-2 bg-white rounded-full shadow-md`}
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`w-full sm:w-1/4 border-r border-gray-200 ${
          isSidebarOpen ? "fixed inset-0 z-40 bg-white" : "hidden sm:block"
        }`}
      >
        <SearchComponent />
        <ContactsComponent />
      </div>

      {/* Main chat area */}
      <MessageBoxComponent />
    </div>
  );
};

export default ChatLayout;
