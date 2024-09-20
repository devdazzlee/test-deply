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
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0); // Track unread messages count
  const { setUnreadRooms, socketInstance, setSocketInstance } =
    useContext(SocketContext);

  const router = useRouter();

  const searchParams = useSearchParams();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const addRequest = searchParams.get("owner_id");

  const getRooms = async () => {
    const response = await axios.get(`/api/room`);

    if (response.status === 200) {
      const fetchedRooms = response.data;
      setRooms(fetchedRooms);
      setFilteredRooms(fetchedRooms);

      // Emit createRoom event for each fetched room
      fetchedRooms.forEach(room => {
        socketInstance.emit("createRoom", {
          roomId: room.id,
          participants: [room.user1.id, room.user2.id]
        });
      });

      const room = fetchedRooms.find(
        room => room.user1.id === addRequest || room.user2.id === addRequest
      );
      if (room) {
        setSelectedRoom(room);
      }
      calculateUnreadMessages(fetchedRooms);
      setIsLoading(false);
    }
  };

  const calculateUnreadMessages = rooms => {
    const totalUnread = rooms.reduce((count, room) => {
      const unreadMessages = room.messages.filter(
        msg => !msg.read && msg.senderId !== currentUser.id
      ).length;
      return count + unreadMessages;
    }, 0);
    setUnreadCount(totalUnread);
  };

  const addToContacts = async () => {
    if (!addRequest) return;

    if (addRequest === currentUser.id) {
      return toast.error("You Cannot Chat With Your Own");
    }

    setIsLoading(true);

    const response = await axios.post(`/api/room`, { userId2: addRequest });

    if (response.status === 200) {
      const newRoom = response.data;
      socketInstance.emit("createRoom", {
        roomId: newRoom.id,
        participants: [currentUser.id, addRequest]
      });
      await getRooms();
    }
  };

  const handleSearch = searchedRooms => {
    setFilteredRooms(searchedRooms);
  };

  // Handle room selection and update unread count
  const handleRoomSelect = async room => {
    setSelectedRoom(room);
    setIsSidebarOpen(false);

    // Find unread messages that are not sent by the current user
    const unreadMessages = room.messages.filter(
      msg => !msg.read && msg.senderId !== currentUser.id
    );

    // Only decrease unread count if there are unread messages
    if (unreadMessages.length > 0) {
      setUnreadCount(prevCount => prevCount - unreadMessages.length);
    }

    // Mark unread messages as read and update in the database
    for (const message of unreadMessages) {
      await axios.put("/api/message", { uuid: message.uuid });
    }

    // Update the room's messages to mark as read in the state
    setRooms(prevRooms =>
      prevRooms.map(r =>
        r.id === room.id
          ? {
              ...r,
              messages: r.messages.map(msg =>
                msg.senderId !== currentUser.id ? { ...msg, read: true } : msg
              )
            }
          : r
      )
    );
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

  const handleRoomDelete = (roomId: string) => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
    setFilteredRooms(prevFilteredRooms =>
      prevFilteredRooms.filter(room => room.id !== roomId)
    );
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
    }
  };

  const updateRoomMessages = async message => {
    if (!message || !message.roomId) return;

    // Update the selectedRoom if it matches the roomId
    setUnreadCount(prevCount => prevCount + 1);
    if (selectedRoom?.id === message.roomId) {
      setSelectedRoom(prevSelectedRoom => ({
        ...prevSelectedRoom,
        messages: [
          ...(prevSelectedRoom.messages || []),
          { ...message.message, read: true }
        ]
      }));

      // Mark the message as read in the database
      await axios.put("/api/message", { uuid: message.message.uuid });
    } else {
      // Increase unread count only for rooms that are not selected

      // Update rooms with unread message
      setRooms(prevRooms =>
        prevRooms.map(room =>
          room.id === message.roomId
            ? {
                ...room,
                messages: [
                  ...(room.messages || []),
                  { ...message.message, read: false }
                ]
              }
            : room
        )
      );
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
    if (socketInstance) {
      if (addRequest) addToContacts();
      else getRooms();
    }
  }, [searchParams, socketInstance]);

  useEffect(() => {
    if (socketInstance) {
      // Handler function for incoming messages
      const handleMessage = message => {
        updateRoomMessages(message);
      };

      const handleRoomDeleted = (roomId: string) => {
        handleRoomDelete(roomId);
      };

      // Attach the listener
      socketInstance.on("message", handleMessage);
      socketInstance.on("roomDeleted", handleRoomDeleted);

      // Cleanup the listener on component unmount or when socketInstance changes
      return () => {
        socketInstance.off("message", handleMessage);
        socketInstance.off("roomDeleted", handleRoomDeleted);
      };
    }
  }, [socketInstance, selectedRoom]);

  useEffect(() => {
    // Count how many rooms have unread messages
    const roomsWithUnreadMessages = rooms.filter(room =>
      room.messages.some(msg => !msg.read && msg.senderId !== currentUser.id)
    ).length;
    setUnreadRooms(roomsWithUnreadMessages);
  }, [unreadCount, rooms]);
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
