import React, { useEffect, useRef, useState } from "react";
import { Input } from "@nextui-org/react";
import { FiPaperclip, FiSend, FiTrash2 } from "react-icons/fi";

import { Socket } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
}

interface Room {
  id: string;
  user1: {
    id: string;
    name: string;
    image: string | null;
  };
  user2: {
    id: string;
    name: string;
    image: string | null;
  };
  messages: Message[];
  updatedAt: string;
}

interface MessageBoxComponentProps {
  selectedRoom: Room | null;
  currentUserId: string;
  socketInstance: Socket;
  setSelectedRoom: () => void;
  setRooms: Room[];
  onRoomDelete: (roomId: string) => void;
}

const MessageBoxComponent: React.FC<MessageBoxComponentProps> = ({
  selectedRoom,
  currentUserId,
  socketInstance,
  setSelectedRoom,
  setRooms,
  onRoomDelete
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const messageContainerRef = useRef();

  let contact;

  if (selectedRoom) {
    contact =
      selectedRoom.user1.id === currentUserId
        ? selectedRoom.user2
        : selectedRoom.user1;
  }

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedRoom || !contact) return;

    const message = {
      id: Date.now().toString(), // Generate a unique ID for the message
      content: newMessage,
      createdAt: new Date().toISOString(),
      senderId: currentUserId,
      receiverId: contact.id,
      roomId: selectedRoom.id // Include roomId in the message
    };

    // Emit the message to the server
    socketInstance.emit("message", {
      roomId: selectedRoom.id,
      message
    });

    // Update the selectedRoom if it matches the roomId
    setSelectedRoom(prevRoom => ({
      ...prevRoom,
      messages: [...(prevRoom.messages || []), message] // Append the entire message object
    }));

    // Update the messages in the specific room in the rooms array
    setRooms(prevRooms =>
      prevRooms.map(room =>
        room.id === selectedRoom.id
          ? { ...room, messages: [...(room.messages || []), message] } // Append the entire message object
          : room
      )
    );

    setNewMessage("");

    const response = await axios.post(`/api/message`, {
      senderId: currentUserId,
      content: newMessage,
      roomId: selectedRoom.id
    });
    console.log(response.status);
  };
  useEffect(() => {
    if (socketInstance && selectedRoom) {
      const contact =
        selectedRoom.user1.id === currentUserId
          ? selectedRoom.user2
          : selectedRoom.user1;

      socketInstance.emit(
        "checkUserOnline",
        contact.id,
        (isOnline: boolean) => {
          setIsOnline(isOnline);
        }
      );

      // Listen for real-time updates on online status
      socketInstance.on(
        "updateOnlineStatus",
        (userId: string, isOnline: boolean) => {
          if (contact.id === userId) {
            setIsOnline(isOnline);
          }
        }
      );

      // Cleanup listener on component unmount
      return () => {
        socketInstance.off("updateOnlineStatus");
      };
    }
  }, [socketInstance, selectedRoom, currentUserId]);

  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  };

  const handleDeleteRoom = async () => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      socketInstance.emit("deleteRoom", selectedRoom.id);
      onRoomDelete(selectedRoom.id);
      setSelectedRoom(null);

      const response = await axios.delete(`/api/room/${selectedRoom.id}`);

      if (response.status === 200) {
        window.location.href = "/messages";
        toast.success("Room Deleted!");
      } else {
        toast.error("Room Not Deleted!");
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedRoom?.messages]);

  if (!selectedRoom) {
    return (
      <div className='flex-1 h-[80vh] w-full flex items-center justify-center'>
        <p>Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col h-full w-full'>
      <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
        <div className='flex items-center space-x-3'>
          <div className='size-12 bg-gray-300 flex items-center justify-center rounded-full'>
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className='font-semibold'>{contact.name}</h2>
            <span
              className={`text-sm ${
                isOnline ? "text-green-500" : "text-black"
              }`}
            >
              {isOnline === true ? "Active" : "Offline"}
            </span>
          </div>
        </div>
        <button
          onClick={handleDeleteRoom}
          className='p-2 hover:bg-gray-100 rounded-full mr-10 xl:mr-0'
          title='Delete Room'
        >
          <FiTrash2 size={20} />
        </button>
      </div>

      <div
        className='flex-1 overflow-y-auto p-4 scroll-smooth'
        ref={messageContainerRef}
      >
        {selectedRoom.messages.map(message => (
          <div
            key={message.id}
            className={`mb-4 ${
              message?.senderId === currentUserId ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message?.senderId === currentUserId
                  ? "bg-black text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.content}
            </div>
            <div className='text-xs text-gray-500 mt-1'>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
              })}{" "}
            </div>
          </div>
        ))}
      </div>

      <div className='border-t border-gray-200 p-4'>
        <div className='flex items-center space-x-2'>
          <button className='p-2 hover:bg-gray-100 rounded-full'>
            <FiPaperclip size={20} />
          </button>
          <Input
            variant='flat'
            radius='sm'
            placeholder='Type Your Message'
            className='flex-1'
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyUp={e => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <button
            className='p-2.5 bg-black text-white rounded-md'
            onClick={handleSendMessage}
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageBoxComponent;
