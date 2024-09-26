"use client";

import React, { createContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import io from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

export const SocketContext = createContext();

let socket;

export default function SocketState({ children, currentUser }) {
  const [socketInstance, setSocketInstance] = useState(null);
  const [unreadRooms, setUnreadRooms] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

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
  }, [status, currentUser]);

  useEffect(() => {
    if (socketInstance) {
      getRooms();
    }
  }, [socketInstance]);

  useEffect(() => {
    if (socketInstance) {
      socketInstance.on("message", handleMessage);
      socketInstance.on("roomDeleted", handleRoomDelete);

      return () => {
        socketInstance.off("message", handleMessage);
        socketInstance.off("roomDeleted", handleRoomDelete);
      };
    }
  }, [socketInstance, selectedRoom]);

  useEffect(() => {
    const roomsWithUnreadMessages = rooms.filter(room =>
      room.messages.some(msg => !msg.read && msg.senderId !== currentUser.id)
    ).length;
    setUnreadRooms(roomsWithUnreadMessages);
  }, [unreadCount, rooms, currentUser]);

  const getRooms = async addRequest => {
    const response = await axios.get(`/api/room`);

    if (response.status === 200) {
      const fetchedRooms = response.data;
      setRooms(fetchedRooms);
      setFilteredRooms(fetchedRooms);

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

  const addToContacts = async addRequest => {
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
      await getRooms(addRequest);
    }
  };

  const handleSearch = searchedRooms => {
    setFilteredRooms(searchedRooms);
  };

  const handleRoomSelect = async room => {
    setSelectedRoom(room);

    const unreadMessages = room.messages.filter(
      msg => !msg.read && msg.senderId !== currentUser.id
    );

    if (unreadMessages.length > 0) {
      setUnreadCount(prevCount => prevCount - unreadMessages.length);
    }

    for (const message of unreadMessages) {
      await axios.put("/api/message", { uuid: message.uuid });
    }

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

  const handleRoomDelete = roomId => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
    setFilteredRooms(prevFilteredRooms =>
      prevFilteredRooms.filter(room => room.id !== roomId)
    );
    if (selectedRoom?.id === roomId) {
      setSelectedRoom(null);
    }
  };

  const handleMessage = async message => {
    if (!message || !message.roomId) return;

    setUnreadCount(prevCount => prevCount + 1);
    if (selectedRoom?.id === message.roomId) {
      setSelectedRoom(prevSelectedRoom => ({
        ...prevSelectedRoom,
        messages: [
          ...(prevSelectedRoom.messages || []),
          { ...message.message, read: true }
        ]
      }));

      await axios.put("/api/message", { uuid: message.message.uuid });
    } else {
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

    await updateRooms(message);
    await updateFilteredRooms(message);
  };

  const updateRooms = async message => {
    setRooms(prevRooms => updateRoomList(prevRooms, message));
  };

  const updateFilteredRooms = async message => {
    setFilteredRooms(prevFilteredRooms =>
      updateRoomList(prevFilteredRooms, message)
    );
  };

  const updateRoomList = (roomList, message) => {
    const roomExists = roomList.some(room => room.id === message.roomId);

    if (roomExists) {
      return roomList.map(room =>
        room.id === message.roomId
          ? {
            ...room,
            messages: [...(room.messages || []), message.message]
          }
          : room
      );
    }
    return roomList;
  };

  return (
    <SocketContext.Provider
      value={{
        socketInstance,
        setSocketInstance,
        unreadRooms,
        setUnreadRooms,
        rooms,
        setRooms,
        filteredRooms,
        setFilteredRooms,
        selectedRoom,
        setSelectedRoom,
        isLoading,
        setIsLoading,
        unreadCount,
        setUnreadCount,
        getRooms,
        addToContacts,
        handleSearch,
        handleRoomSelect,
        handleRoomDelete,
        handleMessage
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
