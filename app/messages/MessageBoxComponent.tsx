// MessageBoxComponent.tsx
import React from "react";
import { Input } from "@nextui-org/react";
import { FiPaperclip, FiSend } from "react-icons/fi";

const MessageBoxComponent: React.FC = () => {
  return (
    <div className='flex-1 flex flex-col'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
          <div>
            <h2 className='font-semibold'>John Doe</h2>
            <span className='text-sm text-green-500'>Active</span>
          </div>
        </div>
      </div>

      {/* Chat messages would go here */}
      <div className='flex-1 overflow-y-auto p-4'>
        {/* Chat messages content */}
      </div>

      {/* Footer with input */}
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
          />
          <button className='p-2.5 bg-black text-white rounded-md'>
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default MessageBoxComponent;
