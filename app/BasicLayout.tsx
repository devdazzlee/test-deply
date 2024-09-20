"use client";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";
import { Providers } from "./providers";
import { SafeUser } from "./types";
import SocketState from "./context/SocketContext";
import { SessionContext, SessionProvider } from "next-auth/react";

export default function BasicLayout({
  children,
  currentUser,
  subStatus
}: Readonly<{
  children: React.ReactNode;
  currentUser: SafeUser;
  subStatus: any;
}>) {
  return (
    <>
      <SessionProvider>
        <SocketState currentUser={currentUser}>
          <ToasterProvider />
          <SearchModal />
          <RentModal />
          <LoginModal />
          <RegisterModal />
          <Navbar currentUser={currentUser} subStatus={subStatus} />

          <Providers>
            <div className='pb-20 pt-28'>{children}</div>
          </Providers>
          <Footer currentUser={currentUser} />
        </SocketState>
      </SessionProvider>
    </>
  );
}
