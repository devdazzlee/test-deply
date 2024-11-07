import { Suspense } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ListingCard from "../components/listings/ListingCard";
import { SafeListing, SafeUser } from "../types";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import { PiUserListFill } from "react-icons/pi";

interface FavoriteClientProps {
  listings: SafeListing[];
  currentUser?: SafeUser | null;
}

const FavoriteClient: React.FC<FavoriteClientProps> = ({
  listings,
  currentUser
}) => {
  if (listings.length == 0) {
    return (
      <Suspense>
        <ClientOnly>
          <div className='mx-6 md:mx-16 text-2xl flex items-center gap-2 font-bold py-6'>
            <PiUserListFill />
            <h1>Your Favorites</h1>
          </div>
          <EmptyState
            title='No favorites found'
            subtitle='Looks like you have no favorite listings.'
          />
        </ClientOnly>
      </Suspense>
    );
  }

  return (
    <div className="mx-6 md:mx-16 py-6">
      <Heading
        title='Favorites'
        subtitle='List of creators you have favorited!'
      />

      <div className='mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8'>
        {listings.map(listing => (
          <ListingCard
            type=''
            currentUser={currentUser}
            key={listing.id}
            data={listing}
            listingUserName={null}
            listingUserImage={undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoriteClient;
