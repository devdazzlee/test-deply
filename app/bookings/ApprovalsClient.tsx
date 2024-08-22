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

  if (approvals.length == 0) {
    return (
      <ClientOnly>
        <div className="text-2xl flex items-center gap-2 font-bold md:py-6 py-8 p-8 w-full">
          <FaListCheck />
          <h1>

            Your Approvals
          </h1>
        </div>
        <EmptyState
          title='No requests to approve'
          subtitle="Looks like there aren't any potential bookings yet"
        />
      </ClientOnly>
    );
  }
  const router = useRouter();
  const [cancelId, setCancelingid] = useState("");
  const [approveId, setApproveid] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setCancelingid(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Request cancelled");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong when cancelling request");
        })
        .finally(() => {
          setCancelingid("");
        });
    },
    [router]
  );

  const onApprove = useCallback(
    (id: string) => {
      setApproveid(id);

      axios
        .put(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Request approved");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong when approving request");
        })
        .finally(() => {
          setApproveid("");
        });
    },
    [router]
  );

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
            onAction={onApprove}
            disabled={cancelId == reservation.id}
            actionLabel='Approve booking request'
            currentUser={currentUser}
            secondarybtn='Reject booking request'
            secondaryOnAction={onCancel}
            listingUserImage={undefined}
            listingUserName={null}
          />
        ))}
      </div>
    </Container>
  );
};

export default ApprovalsClient;
