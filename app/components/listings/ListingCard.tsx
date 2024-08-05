"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";
import Avatar from "../Avatar";
import RatingStars from "../RatingStars";
import Link from "next/link";

interface ListingCardProps {
  data: SafeListing;
  listingUserName: String | null;
  listingUserImage: string | null | undefined;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
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
  actionId = "",
  currentUser,
  secondarybtn,
  secondaryOnAction
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );
  const handleApprove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      secondaryOnAction?.(actionId);
    },
    [secondaryOnAction, actionId, disabled]
  );

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
          {location?.region}, {location?.label}
        </div>
        {listingUserName && (
          <div className='text-md flex flex-row items-center justify-between gap-2'>
            <small>Hosted by {listingUserName}</small>
            <Avatar src={listingUserImage} />
          </div>
        )}

        <div className='flex items-center justify-between'>
          <RatingStars rating={data.averageRating} />
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
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
        {secondarybtn && (
          <>
            <hr />
            <Button
              outline
              small
              label={secondarybtn}
              onClick={handleApprove}
            />
          </>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
