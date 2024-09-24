"use client";

import type { SubStatus } from "@/app/actions/getSubscriptionStatus";
import Container from "../Container";
import Categories from "./Categories";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { SafeUser } from "@/app/types";
import SocketState from "@/app/context/SocketContext";

interface NavbarProps {
  currentUser?: SafeUser | null;
  subStatus?: SubStatus | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, subStatus }) => {
  return (
    <div className='fixed w-full bg-white z-20 shadow-sm'>
      <div
        className='
            py-4
            border-b-[1px]
            '
      >
        <Container>
          <div className='hidden sm:flex flex-row items-center justify-between gap-3 md:gap-0'>
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser} subStatus={subStatus} />
          </div>
          <div className='sm:hidden flex flex-col gap-3'>
            <div className='flex flex-row justify-between w-full'>
              <Logo />
              <UserMenu currentUser={currentUser} subStatus={subStatus} />
            </div>
            <Search />
          </div>
        </Container>
      </div>
      <Categories />
    </div>
  );
};

export default Navbar;
