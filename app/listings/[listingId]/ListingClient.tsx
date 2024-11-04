"use client";

import CommentSection from "@/app/components/CommentSection/CommentSection";
import Container from "@/app/components/Container";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import ListingReservation from "@/app/components/listings/ListingReservation";
import useLoginModal from "@/app/hooks/useLoginModal";
import {
  SafeListing,
  SafeUser,
  SafeReservation,
  SafeComment
} from "@/app/types";
import axios from "axios";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { useRouter } from "next/navigation";
import { useMemo, useState, useCallback, useEffect } from "react";
import { Range } from "react-date-range";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { SessionProvider } from "next-auth/react";
import getReservations from "@/app/actions/getReservations";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection"
};

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser;
  };
  currentUser: SafeUser | null | undefined;
  comments?: SafeComment[];
  hasReservation: boolean
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
  comments = [],
  hasReservation
}) => {
  const loginModal = useLoginModal();
  const router = useRouter();

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach(reservations => {
      const range = eachDayOfInterval({
        start: new Date(reservations.startDate),
        end: new Date(reservations.endDate)
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  const onCreateReservation = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/api/reservations", {
        totalPrice,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        listingId: listing?.id
      });

      const { sessionId } = response.data;

      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
      if (stripe && sessionId) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        throw new Error("Stripe initialisation failed");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [totalPrice, dateRange, listing?.id, router, currentUser, loginModal]);



  // const category = useMemo(() => {
  //     return categories.filter((item) => item.label == listing.category);
  // }, [listing.category]);

  return (
    <Container>
      <div className='max-w-screen-lg mx-auto mt-16 sm:mt-0'>
        <div className='flex flex-col gap-6'>
          <ListingHead
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            id={listing.id}
            currentUser={currentUser}
          />
          <div className='grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6'>
            <ListingInfo
              listingId={listing.id}
              listingApproved={listing.approved || false}
              currentUser={currentUser}
              user={listing.user}
              category={listing.category}
              bio={listing.bio}
              maxDays={listing.maxDays}
              experience={listing.experience}
              minDays={listing.minDays}
              locationValue={listing.locationValue}
              locationCoords={listing.locationCoordinates}
              averageRating={listing.averageRating}
              numberOfRatings={listing.numberOfRatings}
            />
            <div className='order-first mb-10 md:order-last md:col-span-3'>
              <ListingReservation
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={value => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading}
                disabledDates={disabledDates}
                listingOwner={listing.user}
                currentUser={currentUser}
              />
            </div>
          </div>
        </div>
        <div className='mt-8'>
          <hr />
          <CommentSection
            listingId={listing.id}
            comments={comments}
            currentUser={currentUser}
            hasReservation={hasReservation}
          />
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
