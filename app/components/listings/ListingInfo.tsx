"use client";

import useCountries from "@/app/hooks/useCountries";
import { SafeUser } from "@/app/types";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import dynamic from "next/dynamic";
import { useState } from "react";
import RatingStars from "../RatingStars";
import { Button } from "@nextui-org/react";
import { IconHomeCheck } from "@tabler/icons-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Map = dynamic(() => import("../GoogleMaps"), {
  ssr: false
});

interface ListingInfoProps {
  listingId: string;
  listingApproved: boolean;
  currentUser: SafeUser | null | undefined;
  user: SafeUser;
  description: string;
  experience: number;
  maxDays: number;
  minDays: number;
  category: string[] | undefined;
  locationValue: string;
  locationCoords: string[];
  averageRating: number | null;
  numberOfRatings: number | null;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  listingId,
  listingApproved,
  currentUser,
  user,
  description,
  experience,
  maxDays,
  minDays,
  category,
  locationValue,
  locationCoords,
  averageRating,
  numberOfRatings
}) => {
  const router = useRouter();
  const { getByValue } = useCountries();

  const coordinates = locationCoords;

  // State to manage whether to show all categories or not
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Function to toggle the state when "Show More" button is clicked
  const toggleShowAllCategories = () => {
    setShowAllCategories(prevState => !prevState);
  };

  const [approving, setApproving] = useState(false);

  const approveListing = () => {
    setApproving(true);
    axios
      .post(`/api/listings/${listingId}/approve`)
      .then(() => {
        toast.success("Listing approved");
        router.refresh();
      })
      .catch(error => {
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        setApproving(false);
      });
  };

  return (
    <div className='col-span-4 flex flex-col gap-8'>
      <div className='flex flex-col gap-2'>
        {currentUser?.role === "admin" && !listingApproved && (
          <Button
            color='danger'
            variant='solid'
            className='!font-bold mt-6 self-start mb-4'
            size='lg'
            endContent={<IconHomeCheck />}
            onClick={approveListing}
            isLoading={approving}
          >
            Approve Listing
          </Button>
        )}

        <div className='text-xl font-semibold flex flex-row items-center gap-2'>
          <div>Hosted by {user?.name}</div>
          <Avatar src={user?.image} />
        </div>

        <div className='flex items-center'>
          {
            <RatingStars
              rating={averageRating}
              numberOfRatings={numberOfRatings}
            />
          }
        </div>

        <div className='flex flex-row items-center gap-4 font-light text-neutral-500'>
          <div>{experience}/yrs experiance</div>
          <div>{maxDays}/day maximum</div>
          <div>{minDays}/day minimum</div>
        </div>
      </div>

      <hr />
      <div className='text-lg font-light text-neutral-500'>{description}</div>
      <hr />
      <Map position={coordinates} />
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
