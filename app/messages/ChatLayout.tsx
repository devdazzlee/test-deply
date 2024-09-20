"use client";
import React, { useContext, useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import SearchComponent from "./SearchComponent";
import ContactsComponent from "./ContactsComponent";
import MessageBoxComponent from "./MessageBoxComponent";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";
import { SessionContext, SessionProvider } from "next-auth/react";
import { SocketContext } from "../context/SocketContext";

const ChatLayout: React.FC = ({ currentUser }: { currentUser: any }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread messages count
  const {
    rooms,
    filteredRooms,
    selectedRoom,
    isLoading,
    handleSearch,
    handleRoomSelect,
    handleRoomDelete,
    socketInstance,
    toggleSidebar,
    setSelectedRoom,
    setRooms,
    getRooms,
    addToContacts
  } = useContext(SocketContext);

  const searchParams = useSearchParams();

  const addRequest = searchParams.get("owner_id");

  useEffect(() => {
    if (socketInstance) {
      if (addRequest) addToContacts(addRequest);
      else getRooms();
    }
  }, [searchParams, socketInstance]);

  return (
    <div className='flex flex-col justify-center items-start xl:flex-row mt-10 xl:mt-0  h-[82vh] xl:h-[90vh] bg-white'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button
            className={`xl:hidden fixed ${
              isSidebarOpen ? "top-2" : "top-[10.5rem]"
            } right-4 z-50 p-2 bg-white rounded-full shadow-md`}
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div
            className={`w-full xl:w-1/4 border-r border-gray-200 ${
              isSidebarOpen ? "fixed inset-0 z-40 bg-white" : "hidden xl:block"
            }`}
          >
            <SessionProvider>
              <SearchComponent rooms={rooms} onSearch={handleSearch} />
              <ContactsComponent
                rooms={filteredRooms}
                onRoomSelect={handleRoomSelect}
                currentUserId={currentUser.id}
                selectedRoom={selectedRoom}
              />
            </SessionProvider>
          </div>
          <MessageBoxComponent
            selectedRoom={selectedRoom}
            currentUserId={currentUser.id}
            socketInstance={socketInstance}
            setSelectedRoom={setSelectedRoom}
            setRooms={setRooms}
            onRoomDelete={handleRoomDelete}
          />
        </>
      )}
    </div>
  );
};

export default ChatLayout;
