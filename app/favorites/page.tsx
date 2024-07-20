import getCurrentUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import FavoriteClient from "./FavoriteClient";
import { Suspense } from "react";

const ListingPage = async () => {
  const listings = await getFavoriteListings();
  const currentUser = await getCurrentUser();

  if (listings.length == 0) {
    return (
      <Suspense>
        <ClientOnly>
          <EmptyState
            title='No favorites found'
            subtitle='Looks like you have no favorite listings.'
          />
        </ClientOnly>
      </Suspense>
    );
  }

  return (
    <Suspense>
      <ClientOnly>
        <FavoriteClient listings={listings} currentUser={currentUser} />
      </ClientOnly>
    </Suspense>
  );
};

export default ListingPage;
