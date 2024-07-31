"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";
import { useState } from "react";

const Map = dynamic(() => import("../Map"), {
  ssr: false
});

interface ListingInfoProps {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category: string[] | undefined;
  locationValue: string;
  averageRating: number | null;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
  averageRating
}) => {
  const { getByValue } = useCountries();

  const coordinates = getByValue(locationValue)?.latlng;

  // State to manage whether to show all categories or not
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Function to toggle the state when "Show More" button is clicked
  const toggleShowAllCategories = () => {
    setShowAllCategories(prevState => !prevState);
  };

  var rating = [0];
  if (averageRating !== null && typeof averageRating === "number") {
    for (var i = 1; i < averageRating; i++) {
      rating.push(i);
    }
  }

  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        <div className='text-xl font-semibold flex flex-row items-center gap-2'>
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>

        <div className='flex items-center'>
          {rating.map((_, index) => (
            <svg
              key={index}
              className='w-4 h-4 text-rose-500 me-1'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 22 20'
            >
              <path d='M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z' />
            </svg>
          ))}
          <span className='w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400'></span>
          <p className='ms-2 text-sm font-bold font-light text-neutral-500'>
            {averageRating && Math.ceil(averageRating)}
          </p>
        </div>

        <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
          <div>{guestCount}/yrs experiance</div>
          <div>{roomCount}/day maximum</div>
          <div>{bathroomCount}/day minimum</div>
        </div>
      </div>

      <hr />
      <div className='text-lg font-light text-neutral-500'>{description}</div>
      <hr />
      <Map center={coordinates} />
      <hr />

      <div className='flex flex-wrap gap-x-4 gap-y-2'>
        {/* Render either all categories or a limited number based on showAllCategories state */}
        {showAllCategories
          ? category?.map(item => <ListingCategory key={item} label={item} />)
          : category
              ?.slice(0, 6)
              .map(item => <ListingCategory key={item} label={item} />)}
        {/* Show More button */}
        {category?.length && category.length > 6 ? (
          <button
            className='hover:bg-theme hover:text-white border-theme border-2 text-theme shadow-sm w-fit rounded-xl px-2 py-1'
            onClick={toggleShowAllCategories}
          >
            {showAllCategories ? "Hide Categories" : "Show More"}
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ListingInfo;
