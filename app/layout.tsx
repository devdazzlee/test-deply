import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import RegisterModal from "./components/modals/RegisterModal";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";
import { Providers } from "./providers";
import getSubscriptionStatus from "./actions/getSubscriptionStatus";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shutter Guide",
  description: "Airbnb but for creators"
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();
  const subStatus = await getSubscriptionStatus();

  return (
    <html lang='en'>
      <body className={inter.className}>
        <ToasterProvider />
        <SearchModal />
        <RentModal />
        <LoginModal />
        <RegisterModal />
        <Navbar currentUser={currentUser} subStatus={subStatus} />

        <Providers>
          <div className='pb-20 pt-28'>{children}</div>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}