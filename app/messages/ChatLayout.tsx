"use client";
import React, { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import SearchComponent from "./SearchComponent";
import ContactsComponent from "./ContactsComponent";
import MessageBoxComponent from "./MessageBoxComponent";
import io, { Socket } from "socket.io-client";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";
import { SessionContext, SessionProvider } from "next-auth/react";

let socket: Socket;

const ChatLayout: React.FC = ({ currentUser }: { currentUser: any }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socketInstance, setSocketInstance] = useState(null);

  const searchParams = useSearchParams();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const addRequest = searchParams.get("owner_id");

  const getRooms = async () => {
    const response = await axios.get(`/api/room`);

    if (response.status === 200) {
      setRooms(response.data);
      setFilteredRooms(response.data);

      const room = response.data.find(
        room => room.user1.id === addRequest || room.user2.id === addRequest
      );
      if (room) {
        setSelectedRoom(room);
      }
      setIsLoading(false);
    }
  };

  const addToContacts = async () => {
    if (!addRequest) return;

    if (addRequest === currentUser.id) {
      return toast.error("You Cannot Chat With Your Own");
    }

    setIsLoading(true);
    const response = await axios.post(`/api/room`, { userId2: addRequest });

    if (response.status === 200) {
      getRooms();
    }
  };

  const handleSearch = searchedRooms => {
    setFilteredRooms(searchedRooms);
  };

  const handleRoomSelect = room => {
    setSelectedRoom(room);
  };

  // Helper function to check if a room exists in a list
  const roomExistsInList = (rooms, roomId) => {
    return rooms.some(room => room.id === roomId);
  };

  // Helper function to update an existing room with a new message
  const updateExistingRoom = (rooms, roomId, message) => {
    return rooms?.map(room =>
      room.id === roomId
        ? {
            ...room,
            messages: [...(room.messages || []), message]
          }
        : room
    );
  };

  // Helper function to add a new room and fetch its details
  const addNewRoom = async (rooms, roomId, message) => {
    try {
      const response = await axios.get(`/api/room/${roomId}`);
      if (response.status === 200) {
        return [
          ...rooms,
          {
            ...response.data,
            messages: [message] // Initialize with the incoming message
          }
        ];
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      return rooms;
    }
  };

  // Main function to update room messages
  const updateRoomMessages = async message => {
    if (!message || !message.roomId) return;

    // Update the selectedRoom if it matches the roomId
    if (selectedRoom?.id === message.roomId) {
      setSelectedRoom(prevSelectedRoom => ({
        ...prevSelectedRoom,
        messages: [...(prevSelectedRoom.messages || []), message.message]
      }));
    }

    // Update rooms and filteredRooms asynchronously
    await updateRooms(message);
    await updateFilteredRooms(message);
  };

  // Function to handle rooms update
  const updateRooms = async message => {
    return setRooms(prevRooms => {
      const roomExists = roomExistsInList(prevRooms, message.roomId);

      if (roomExists) {
        const updated = updateExistingRoom(
          prevRooms,
          message.roomId,
          message.message
        );
        return updated;
      } else return prevRooms;
    });
  };

  // Function to handle filteredRooms update
  const updateFilteredRooms = async message => {
    return setFilteredRooms(prevFilteredRooms => {
      const roomExists = roomExistsInList(prevFilteredRooms, message.roomId);

      if (roomExists) {
        const updated = updateExistingRoom(
          prevFilteredRooms,
          message.roomId,
          message.message
        );
        return updated;
      }
      return prevFilteredRooms;
    });
  };

  useEffect(() => {
    if (addRequest) addToContacts();
    else getRooms();
  }, [searchParams]);

  useEffect(() => {
    socket = io({
      query: {
        userId: currentUser.id
      }
    });

    setSocketInstance(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketInstance) {
      // Handler function for incoming messages
      const handleMessage = message => {
        updateRoomMessages(message);
      };

      // Attach the listener
      socketInstance.on("message", handleMessage);

      // Cleanup the listener on component unmount or when socketInstance changes
      return () => {
        socketInstance.off("message", handleMessage);
      };
    }
  }, [socketInstance, selectedRoom]);

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
          />
        </>
      )}
    </div>
  );
};

export default ChatLayout;
