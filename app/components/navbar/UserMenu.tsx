"use client";

import { AiOutlineMenu } from "react-icons/ai";
import Avatar from "../Avatar";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import MenuItem from "./MenuItem";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRentModal from "@/app/hooks/useRentModal";
import { signOut } from "next-auth/react";
import { SafeUser } from "@/app/types";
import Link from "next/link";
import { AiOutlineMessage } from "react-icons/ai";
import { useRouter } from "next/navigation";
import type { SubStatus } from "@/app/actions/getSubscriptionStatus";
import clsx from "clsx";
import { toast } from "react-hot-toast";
import { SocketContext } from "@/app/context/SocketContext";

interface UserMenuProps {
  currentUser?: SafeUser | null;
  subStatus?: SubStatus | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser, subStatus }) => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const rentModal = useRentModal();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { unreadRooms } = useContext(SocketContext);

  const toggleOpen = useCallback(() => {
    setIsOpen(value => !value);
  }, []);

  const onRent = useCallback(() => {
    if (!currentUser) {
      return loginModal.onOpen();
    }


    if (!currentUser.subscriptionOption) {
      router.push("/subscribe");
      return;
    }
    console.log(currentUser);

    if (currentUser?.listingsCount > 0) {

      toast.error(
        "You have already created a listing!"
      );
      return;
    }
    if (
      currentUser.subscriptionOption === "booking_fee" ||
      currentUser.subscriptionOption === "flat_fee"
    ) {
      rentModal.onOpen();
    } else {
      toast.error(
        "Invalid Subscription Option. Please subscribe again or contact support"
      );
      router.push("/subscribe");
    }
  }, [currentUser, loginModal, rentModal]);

  const menuRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className='relative'>
      <div className='flex flex-row items-center gap-3'>
        {currentUser && (
          <Link
            href='/messages'
            className='py-2 px-3 relative rounded-full hover:bg-neutral-100 transition cursor-pointer'
          >
            <AiOutlineMessage size={27} />
            <div className='bg-black text-white text-center rounded-full size-6 absolute top-0 right-0 flex items-center justify-center text-xs'>
              {unreadRooms}
            </div>
          </Link>
        )}
        <div
          onClick={onRent}
          className='hidden md:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer'
        >
          Create Listing
        </div>
        <div
          onClick={toggleOpen}
          ref={menuRef}
          className='p-4 md:py-1 md:px-2 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition'
        >
          <AiOutlineMenu />
          <div className='hidden md:block'>
            {/* ======================= */}
            {/* ======================= */}
            {/* Gold trim here */}
            <Avatar
              src={currentUser?.image}
              isSubscribed={currentUser?.subscriptionOption ? true : false}
            />
            {/* /Gold trim here */}
            {/* ======================= */}
            {/* ======================= */}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='absolute rounded-xl shadow-md w-[40vw] md:w-[200px] bg-white overflow-hidden right-0 top-12 text-sm z-20'>
          <div className='flex flex-col cursor-pointer'>
            {currentUser ? (
              <>
                {currentUser?.subscriptionOption && (
                  <>
                    <div className='flex py-2 p-2 justify-center'>
                      <h1
                        className={clsx(
                          "inline-block bg-clip-text text-transparent",
                          "font-bold text-xl",
                          "bg-gradient-to-r from-amber-600 via-red-400 to-amber-400 bg-clip-text text-transparent"
                        )}
                      >
                        Creator
                      </h1>
                    </div>
                    <hr />
                  </>
                )}
                <div
                  onClick={onRent}
                  className='md:hidden block text-sm font-semibold py-3 px-4 hover:bg-neutral-100 transition cursor-pointer'
                >
                  Create Listing
                </div>


                <MenuItem label='My Profile' href='/profile' />
                <MenuItem label='Approvals and Bookings' href='/bookings' />
                <MenuItem label='Billing and Subscriptions' href='/billing' />
                {currentUser?.role === "admin" && (
                  <MenuItem label='Admin Approvals' href='/admin-approvals' />
                )}
                <MenuItem label='Reservations' href='/reservations' />
                <MenuItem label='Pricing' href='/subscribe' />
                <MenuItem label='Account Settings' href='/account-settings' />

                <hr />

                <MenuItem onClick={() => signOut()} label='Logout' />

                {/* <MenuItem
                  href="/trips"
                  label='My Bookings'
                />
                <MenuItem
                  href="/favorites"
                  label='My Favorites'
                />
                <MenuItem
                  href="/reservations"
                  label='My reservations'
                />
                <MenuItem
                  href="/properties"
                  label='My listing'
                />
                <MenuItem
                  href="/approvals"
                  label='My approvals'
                />
                <MenuItem
                  onClick={rentModal.onOpen}
                  label='Shutter guide my work'
                />
                <MenuItem
                  href="/profile"
                  label='My Profile'
                /> */}
              </>
            ) : (
              <>
                <MenuItem onClick={loginModal.onOpen} label='Login' />
                <MenuItem onClick={registerModal.onOpen} label='Sign up' />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
