"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { format, differenceInDays } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";
import Avatar from "../Avatar";
import RatingStars from "../RatingStars";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ListingCardProps {
  data: SafeListing;
  listingUserName: String | null;
  listingUserImage: string | null | undefined;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  type: string;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  secondarybtn?: string;
  secondaryOnAction?: (id: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  listingUserName,
  listingUserImage,
  reservation,
  onAction,
  disabled,
  actionLabel,
  type,
  actionId = "",
  currentUser,
  secondarybtn,
  secondaryOnAction
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();
  const [disableApproveBtn, setDisableApproveBtn] = useState(false);
  const [disableRejectBtn, setDisableRejectBtn] = useState(false);
  const [disableCompleteBtn, setDisableCompleteBtn] = useState(false);
  const [disableRefundBtn, setDisableRefundBtn] = useState(false);

  const location = getByValue(data.locationValue);

  // for photographer
  const handleApprove = async (event: any) => {
    event.preventDefault()

    if (!data || !data.id) return;
    setDisableApproveBtn(true);

    axios
      .post(`/api/listings/${data.id}/approve`)
      .then(() => {
        toast.success("Request approved");
        setDisableApproveBtn(false);
        router.refresh();
      })
      .catch((error) => {
        console.log(error);

        toast.error("Something went wrong when approving request");
        setDisableApproveBtn(false);
      });
  };

  // for photographer
  const handleReject = async (event: any) => {
    event.preventDefault()
    if (!data || !data.id) return;

    setDisableRejectBtn(true);

    axios
      .delete(`/api/listings/${data.id}`)
      .then(() => {
        toast.success("Request rejected");

        setDisableRejectBtn(false);
        router.refresh();
      })
      .catch(() => {
        setDisableRejectBtn(false);
        toast.error("Something went wrong when rejecting request");
      })

  };

  // for user who booked
  const handleCompleted = async () => {

    if (!reservation || !reservation.id) return;
    setDisableCompleteBtn(true);

    try {
      const response = await axios.put(
        `/api/reservations/approve-reservation/${reservation.id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        toast.success("Reservation Completed!");
        setDisableCompleteBtn(false);
      } else {
        console.error("Error approving reservation:", response.data);
        toast.error("Failed to approve the reservation. Please try again.");
        setDisableCompleteBtn(false);
      }
    } catch (error) {
      setDisableCompleteBtn(false);
      console.error("Error approving reservation:", error);
      toast.error(
        `An error occurred while approving the reservation: ${error}`
      );
    }
  };

  // for user who booked
  const handleRefund = async () => {
    if (!reservation || !reservation.id) return;
    setDisableRefundBtn(true);

    try {
      const response = await axios.put(
        `/api/reservations/refund-reservation/${reservation.id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 200) {
        toast.success("Refund Requested Successsfully!");
        setDisableRefundBtn(false);
      } else {
        console.error("Error requesting refund:", response.data);
        toast.error("Failed to request refund. Please try again.");
        setDisableRefundBtn(false);
      }
    } catch (error) {
      setDisableRefundBtn(false);
      console.error("Error requesting refund:", error);
      toast.error("Failed to request refund. Please try again.");
    }
  };

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }

    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  const jobCompletionTimePeriod = useMemo(() => {
    if (!reservation || !reservation.startDate) {
      return true;
    }

    const startDate = new Date(reservation.startDate);
    const currentDate = new Date();
    const daysDifference = differenceInDays(currentDate, startDate);

    return daysDifference > 14;
  }, [reservation]);

  return (
    <Link
      href={`/listings/${data.id}`}
      className='col-span-1 cursor-pointer group'
    >
      <div className='flex flex-col gap-2 w-full'>
        <div className='aspect-square w-full relative overflow-hidden rounded-xl'>
          <Image
            fill
            alt='Listing'
            src={data.imageSrc[0]}
            className='object-cover h-full w-full group-hover:scale-110 transition'
          />
          <div className='absolute top-3 right-3'>
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
        </div>
        <div className='font-semibold text-lg'>
          {listingUserName}

        </div>
        {listingUserName && (
          <div className='text-md flex flex-row items-center justify-between gap-2'>
            <small>{location?.region}, {location?.label}</small>
            <Avatar src={listingUserImage} />
          </div>
        )}

        <div className='flex items-center justify-between'>
          <RatingStars
            rating={data.averageRating}
            numberOfRatings={data.numberOfRatings}
          />
          <div className='flex flex-row items-center gap-1'>
            <div className='font-semibold'>$ {price} </div>
            {!reservation && <div className='font-light'>day</div>}
          </div>
        </div>

        <div className='font-light text-sm flex flex-wrap flex-row-reverse gap-x-2 text-neutral-500'>
          {reservationDate ||
            (Array.isArray(data.category) &&
              data.category
                .slice(0, 3)
                .map((item, index) => <div key={index}>{item}</div>))}
        </div>
        {type === "approval" && (
          <>
            <Button
              disabled={disableApproveBtn}
              small
              label={
                disableApproveBtn ? "Approving ..." : "Approve Reservation"
              }
              onClick={handleApprove}
            />
            <hr />
            <Button
              disabled={disableRejectBtn}
              outline
              small
              label={disableRejectBtn ? "Rejecting ..." : "Reject Reservation"}
              onClick={handleReject}
            />
          </>
        )}

        {type === "booking" && (
          <>
            <Button
              disabled={disableCompleteBtn}
              small
              label={disableCompleteBtn ? "Completing ..." : "Job Completed"}
              onClick={handleCompleted}
            />
            <hr />
            <Button
              disabled={disableRefundBtn}
              outline
              small
              label={disableRefundBtn ? "Requesting ..." : "Request Refund"}
              onClick={handleRefund}
            />
          </>
        )}

        {type === "your-jobs" && (
          <div className='relative group'>
            <Button
              disabled={!jobCompletionTimePeriod}
              small
              label={
                disableCompleteBtn ? "Completing ..." : "Complete Reservation"
              }
              onClick={handleCompleted}
            />

            {!jobCompletionTimePeriod && (
              <div className='absolute left-1/2 w-[200px] text-center transform -translate-x-1/2 top-full mt-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded px-2 py-1 z-10'>
                Creators can complete the reservation after 14 days of
                reservation start date
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
