"use client";
import { SafeUser } from "@/app/types";
import Link from "next/link";

interface ProfileClientProps {
  currentUser?: SafeUser;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ currentUser: user }) => {
  let currentUser = user ?? ({} as any);
  return (
    <div className='flex py-8 md:py-16 px-4 items-center h-auto flex-wrap mx-auto'>
      <div
        id='profile'
        className='w-full lg:rounded-l-lg lg:rounded-r-none shadow-xl bg-white opacity-75 mx-6 lg:mx-0'
      >
        <div className='w-full px-4 md:px-12 text-center lg:text-left'>
          <div className='flex mx-4 justify-between items-center w-full'>
            <h1 className='text-2xl font-bold text-nowrap'>
              {currentUser.name}
            </h1>
            <div className='rounded flex justify-end px-4'>
              <img
                src={currentUser.image || "/images/placeholder.jpg"}
                className='rounded-full w-1/6 h-1/6 shadow-lg lg:block'
              />
            </div>
          </div>
          <div className='mx-auto lg:mx-0  pt-3 border-b-2 border-green-500 opacity-25'></div>
          <p className='pt-4 text-base font-bold flex items-center justify-center lg:justify-start'>
            <svg
              className='h-4 fill-current text-theme pr-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M9 12H1v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6h-8v2H9v-2zm0-1H0V5c0-1.1.9-2 2-2h4V2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v6h-9V9H9v2zm3-8V2H8v1h4z' />
            </svg>{" "}
            {currentUser.email}
          </p>
          <p className='pt-2 text-gray-600 text-xs lg:text-sm flex items-center justify-center lg:justify-start'>
            <svg
              className='h-4 fill-current text-theme pr-4'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z' />
            </svg>{" "}
            Your Location - 25.0000° N, 71.0000° W
          </p>
          <p className='pt-8 text-sm'>
            Totally optional short description about yourself, what you do and
            so on.
          </p>

          <div className='pt-12 pb-8'>
            <Link
              className='bg-theme hover:bg-hover text-white font-bold py-2 px-4 rounded-full'
              href='/favorites'
            >
              My Favourites
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
