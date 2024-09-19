import React from "react";

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
  messages: Array<{
    content: string;
    createdAt: string;
  }>;
  updatedAt: string;
}

interface ContactsComponentProps {
  rooms: Room[];
  selectedRoom: Room;
  onRoomSelect: (room: Room) => void;
  currentUserId: string;
}

const ContactsComponent: React.FC<ContactsComponentProps> = ({
  rooms,
  onRoomSelect,
  currentUserId,
  selectedRoom
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });
    } else if (days === 1) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={`overflow-y-auto h-[calc(100vh-140px)] xl:h-[80vh]`}>
      {rooms?.length > 0 &&
        rooms?.map(room => {
          const contact =
            room.user1.id === currentUserId ? room.user2 : room.user1;

          const lastMessage = room.messages[room.messages.length - 1];

          return (
            <div
              key={room.id}
              className={`p-4${
                room.id === selectedRoom?.id
                  ? " bg-gray-100"
                  : " hover:bg-gray-100"
              } cursor-pointer`}
              onClick={() => onRoomSelect(room)}
            >
              <div className='flex items-center space-x-3'>
                <div className='size-12 bg-gray-300 flex items-center justify-center rounded-full'>
                  {
                    contact.name.charAt(0).toUpperCase() // Display the first letter as uppercase
                  }
                </div>
                <div className='flex-1'>
                  <div className='flex justify-between items-center'>
                    <span className='font-semibold'>{contact.name}</span>
                    <span className='text-xs text-gray-500'>
                      {lastMessage ? formatDate(lastMessage?.createdAt) : ""}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 truncate'>
                    {lastMessage ? lastMessage?.content : "No messages yet"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ContactsComponent;
