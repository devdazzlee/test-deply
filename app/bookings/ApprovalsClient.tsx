"use client";

import { useRouter } from "next/navigation";
import { SafeReservation, SafeUser } from "../types";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import { FaListCheck } from "react-icons/fa6";

interface ApprovalsClientProps {
  approvals: SafeReservation[];
  currentUser?: SafeUser | null;
}

const ApprovalsClient: React.FC<ApprovalsClientProps> = ({
  approvals,
  currentUser
}) => {
  const router = useRouter();

  if (approvals.length == 0) {
    return (
      <ClientOnly>
        <div className='text-2xl flex items-center gap-2 font-bold md:py-6 py-8 p-8 w-full'>
          <FaListCheck />
          <h1>Your Approvals</h1>
        </div>
        <EmptyState
          title='No requests to approve'
          subtitle="Looks like there aren't any potential bookings yet"
        />
      </ClientOnly>
    );
  }

  return (
    <Container>
      <Heading title='Approvals' subtitle='Approvals on your listings' />

      <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
        {approvals.map(reservation => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            type='approval'
            currentUser={currentUser}
            listingUserImage={undefined}
            listingUserName={null}
          />
        ))}
      </div>
    </Container>
  );
};

export default ApprovalsClient;
