import React from "react";

interface Contact {
  name: string;
  lastMessage: string;
  time: string;
}

const contacts: Contact[] = [
  { name: "John Doe", lastMessage: "Hey, how are you?", time: "10:30 AM" },
  { name: "Jane Smith", lastMessage: "Meeting at 2 PM", time: "Yesterday" },
  { name: "Alice Johnson", lastMessage: "Thanks!", time: "2 days ago" }
  // ... add more contacts as needed
];

const ContactsComponent: React.FC = () => {
  return (
    <div className='overflow-y-auto h-[calc(100vh-140px)] sm:h-[calc(100vh-80px)]'>
      {contacts.map((contact, index) => (
        <div key={index} className='p-4 hover:bg-gray-100 cursor-pointer'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 bg-gray-300 rounded-full'></div>
            <div className='flex-1'>
              <div className='flex justify-between items-center'>
                <span className='font-semibold'>{contact.name}</span>
                <span className='text-xs text-gray-500'>{contact.time}</span>
              </div>
              <p className='text-sm text-gray-600 truncate'>
                {contact.lastMessage}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactsComponent;
