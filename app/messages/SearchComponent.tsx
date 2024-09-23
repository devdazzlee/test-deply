import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";
import { useSession } from "next-auth/react";

interface User {
  id: string;
  name: string;
  image: string | null;
  email: string | null;
}

interface Room {
  id: string;
  user1: User;
  user2: User;
  messages: Array<{
    content: string;
    createdAt: string;
  }>;
  updatedAt: string;
}

interface SearchComponentProps {
  rooms: Room[];
  onSearch: (filteredRooms: Room[]) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  rooms,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: session } = useSession();
  const currentUserId = session?.user?.email;

  useEffect(() => {
    const filteredRooms = rooms.filter(room => {
      const contact =
        room.user1.email === currentUserId ? room.user2 : room.user1;
      return contact.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    onSearch(filteredRooms);
  }, [searchTerm, rooms, currentUserId, onSearch]);

  return (
    <div className='p-4 mt-12 xl:mt-0'>
      <div className='relative'>
        <Input
          variant='flat'
          radius='sm'
          placeholder='Search Contacts'
          startContent={<FiSearch className='text-gray-400' />}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchComponent;
