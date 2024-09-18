// SearchComponent.tsx
import React from "react";
import { Input } from "@nextui-org/react";
import { FiSearch } from "react-icons/fi";

const SearchComponent: React.FC = () => {
  return (
    <div className='p-4 mt-12 sm:mt-0'>
      <div className='relative'>
        <Input
          variant='flat'
          radius='sm'
          placeholder='Search Contacts'
          startContent={<FiSearch className='text-gray-400' />}
        />
      </div>
    </div>
  );
};

export default SearchComponent;
