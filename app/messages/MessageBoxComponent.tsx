import React, { useEffect, useRef, useState } from "react";
import { Input } from "@nextui-org/react";
import { FiPaperclip, FiSend, FiTrash2 } from "react-icons/fi";

import { Socket } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  read: boolean; // New property to track read status
  fileData?: string; // Base64 or URL for file
  fileName?: string; // Name of the file
  fileType?: string; // Type of the file (e.g., image/jpeg, application/pdf)
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
  currentUserId: string | null | undefined;
  socketInstance: Socket;
  setSelectedRoom: React.Dispatch<React.SetStateAction<Room | null>>; // Corrected type for state setter
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>; // Corrected type for state setter
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
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);

  const messageContainerRef = useRef<HTMLDivElement | null>(null);

  let contact: any;

  if (selectedRoom) {
    contact =
      selectedRoom.user1.id === currentUserId
        ? selectedRoom.user2
        : selectedRoom.user1;
  }

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0];
    if (file && selectedRoom) {
      const reader = new FileReader();

      reader.onloadend = async () => {
        setIsSendingMessage(true);
        const base64File = reader.result; // This is base64-encoded file data

        const uuid = uuidv4();
        const message = {
          uuid: uuid, // Generate a unique ID for the message
          content: newMessage || null, // If there's text content along with the file
          createdAt: new Date().toISOString(),
          senderId: currentUserId,
          receiverId: contact.id,
          roomId: selectedRoom.id, // Include roomId in the message

          fileName: file.name,
          fileType: file.type,
          fileData: base64File
        };

        const res = await axios.post(`/api/message`, {
          senderId: currentUserId,
          content: newMessage || null,
          roomId: selectedRoom.id,
          fileName: file.name,
          fileType: file.type,
          fileData: base64File,
          uuid
        });

        if (res.status === 200) {
          // Emit the message to the server
          socketInstance.emit("message", {
            roomId: selectedRoom.id,
            message
          });

          // Update the selectedRoom if it matches the roomId
          setSelectedRoom((prevRoom: any) => ({
            ...prevRoom,
            messages: [...(prevRoom?.messages || []), message] // Append the message object
          }));
          // Update the messages in the specific room in the rooms array
          setRooms((prevRooms: any) =>
            prevRooms.map((room: any) =>
              room.id === selectedRoom.id
                ? { ...room, messages: [...(room.messages || []), message] } // Append the entire message object
                : room
            )
          );

          setNewMessage("");
          setIsSendingMessage(false);
        }
      };

      reader.readAsDataURL(file); // Convert the file to base64 format
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedRoom || !contact) return;

    const uuid = uuidv4();

    setIsSendingMessage(true);

    const message = {
      uuid: uuid, // Generate a unique ID for the message
      content: newMessage,
      createdAt: new Date().toISOString(),
      senderId: currentUserId,
      receiverId: contact.id,
      roomId: selectedRoom.id // Include roomId in the message
    };

    const response = await axios.post(`/api/message`, {
      senderId: currentUserId,
      content: newMessage,
      roomId: selectedRoom.id,
      uuid
    });

    if (response.status === 200) {
      // Emit the message to the server
      socketInstance.emit("message", {
        roomId: selectedRoom.id,
        message
      });

      // Update the selectedRoom if it matches the roomId
      setSelectedRoom((prevRoom: any) => ({
        ...prevRoom,
        messages: [...(prevRoom.messages || []), message] // Append the entire message object
      }));

      // Update the messages in the specific room in the rooms array
      setRooms((prevRooms: any) =>
        prevRooms.map((room: any) =>
          room.id === selectedRoom.id
            ? { ...room, messages: [...(room.messages || []), message] } // Append the entire message object
            : room
        )
      );

      setNewMessage("");
      setIsSendingMessage(false);
    }
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

  // const handleDeleteRoom = async () => {
  //   if (window.confirm("Are you sure you want to delete this room?")) {
  //     socketInstance.emit("deleteRoom", selectedRoom.id);
  //     onRoomDelete(selectedRoom.id);
  //     setSelectedRoom(null);

  //     const response = await axios.delete(`/api/room/${selectedRoom.id}`);

  //     if (response.status === 200) {
  //       window.location.href = "/messages";
  //       toast.success("Room Deleted!");
  //     } else {
  //       toast.error("Room Not Deleted!");
  //     }
  //   }
  // };

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
        {/* <button
          onClick={handleDeleteRoom}
          className='p-2 hover:bg-gray-100 rounded-full mr-10 xl:mr-0'
          title='Delete Room'
        >
          <FiTrash2 size={20} />
        </button> */}
      </div>

      <div
        className='flex-1 overflow-y-auto p-4 scroll-smooth'
        ref={messageContainerRef}
      >
        {selectedRoom.messages.map(message => {
          return (
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
                {message.content && <div>{message.content}</div>}

                {message.fileData && (
                  <div className='mt-2'>
                    {/* <a
                      href={message.fileData}
                      target='_blank'
                      className='text-blue-500 text-sm'
                      rel='noopener noreferrer'
                      download={message.fileName}
                    >
                      {message.fileName}
                    </a> */}

                    {/* Render based on file type */}
                    {message.fileType?.startsWith("image/") && (
                      <img
                        src={message.fileData}
                        alt={message.fileName}
                        className='max-w-xs max-h-xs'
                      />
                    )}
                  </div>
                )}
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}{" "}
              </div>
            </div>
          );
        })}
      </div>

      <div className='border-t border-gray-200 p-4'>
        <div className='flex items-center space-x-2'>
          {/* Hidden file input */}
          <input
            type='file'
            id='file-input'
            accept='image/*'
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* Attachment button */}
          <button
            className='p-2 !-ml-2 hover:bg-gray-100 rounded-full'
            onClick={() => {
              const fileInput = document.getElementById("file-input");
              if (fileInput) {
                fileInput.click();
              }
            }}
          >
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
          {isSendingMessage ? (
            <BeatLoader color='black' />
          ) : (
            <button
              className='p-2.5 bg-black disabled:opacity-60 text-white rounded-md'
              onClick={handleSendMessage}
              disabled={isSendingMessage}
            >
              <FiSend size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBoxComponent;
