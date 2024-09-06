"use client";

import { useRouter } from "next/navigation";
import { FaSwatchbook } from "react-icons/fa";

import { SafeReservation, SafeUser } from "@/app/types";

import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";

interface BookingClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const BookingClient: React.FC<BookingClientProps> = ({
  reservations,
  currentUser
}) => {
  if (reservations.length == 0) {
    return (
      <ClientOnly>
        <div className='text-2xl flex items-center gap-2 font-bold md:py-0 py-16 p-8 w-full'>
          <FaSwatchbook />
          <h1>Your Bookings</h1>
        </div>
        <EmptyState
          title='No bookings found'
          subtitle="Looks like you don't have any bookings."
        />
      </ClientOnly>
    );
  }

  return (
    <Container>
      <Heading title='Reservations' subtitle='Your booking with creators!' />
      <div
        className='
          my-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        '
      >
        {reservations.map((reservation: any) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            type='booking'
            currentUser={currentUser}
            listingUserName={null}
            listingUserImage={undefined}
          />
        ))}
      </div>
    </Container>
  );
};

export default BookingClient;
