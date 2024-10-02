import getCurrentUser from "../actions/getCurrentUser";
import getListings, { IListingsParams } from "../actions/getListings";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import ListingCard from "../components/listings/ListingCard";

interface HomeProps {
  searchParams: IListingsParams;
}

export const dynamic = "force-dynamic";
export default async function AdminApprovals({ searchParams }: HomeProps) {
  const currentUser = await getCurrentUser();
  const listings = await getListings(searchParams, {
    approvalFilter: "unapproved"
  });

  if (listings.length == 0) {
    return <EmptyState title="No listings to approve!" subtitle="Wohoo! You have no listings to approve" />;
  }

  return (
    <Container>
      <div
        className='
        pt-16
        sm:pt-12
        grid
        grid-cols-1
        sm:grid-cols-1
        md:grid-cols-3
        lg:grid-cols-4
        xl:grid-cols-5
        gap-8
        '
      >
        {listings.map(listing => {
          return (
            <ListingCard
              currentUser={currentUser}
              key={listing.id}
              type='approval'
              listingUserName={listing?.user?.name}
              listingUserImage={listing?.user?.image}
              data={listing}
            />
          );
        })}
      </div>
    </Container>
  );
}
