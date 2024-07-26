'use client';

import useCountries from "@/app/hooks/useCountries";
import { SafeListing, SafeReservation, SafeUser } from "@/app/types";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { format } from 'date-fns';
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";
import Avatar from "../Avatar";
import RatingStars from "../RatingStars";

interface ListingCardProps {
    data: SafeListing;
    listingUserName: String | null;
    listingUserImage: string | null | undefined;
    reservation?: SafeReservation;
    onAction?: (id: string) => void;
    disabled?: boolean
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
    secondaryOnAction,
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

        }, [onAction, actionId, disabled]);
    const handleApprove = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (disabled) {
                return;
            }

            secondaryOnAction?.(actionId);

        }, [secondaryOnAction, actionId, disabled]);

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

        return `${format(start, 'PP')} - ${format(end, 'PP')}`

    }, [reservation]);



    return (
        <div onClick={() => router.push(`/listings/${data.id}`)} className="col-span-1 cursor-pointer group">
            <div className="flex flex-col gap-2 w-full">
                <div className="aspect-square w-full relative overflow-hidden rounded-xl">
                    <Image
                        fill
                        alt="Listing"
                        src={data.imageSrc[0]}
                        className="object-cover h-full w-full group-hover:scale-110 transition"
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                {listingUserName && <div className="text-md flex flex-row items-center justify-between gap-2">
                    <div className="font-semibold text-lg">
                        {listingUserName}
                    </div>
                    <Avatar
                        src={listingUserImage}
                    />
                </div>}
                <small>{location?.region}, {location?.label}
                </small>


                <div className="flex items-center">
                    <RatingStars rating={data.averageRating} />
                </div>

                <div className="font-light flex flex-wrap gap-x-2 text-neutral-500">
                    {reservationDate || (Array.isArray(data.category) && data.category.slice(0, 3).map((item, index) => <div key={index}>{item}</div>))}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">$ {price} </div>
                    {!reservation && (
                        <div className="font-light">day</div>
                    )}
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

        </div>
    );
}

export default ListingCard;