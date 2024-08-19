import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import BookingClient from "./BookingsClient";
import ApprovalsClient from "./ApprovalsClient";
import getApprovals from "../actions/getApprovals";

const BookingPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title='Unauthorised' subtitle='Please login' />
      </ClientOnly>
    );
  }

  const approvals = await getApprovals({
    authorId: currentUser.id
  });
  const reservations = await getReservations({
    userId: currentUser.id
  });



  return (
    <ClientOnly>
      <BookingClient reservations={reservations} currentUser={currentUser} />
      <hr />
      <ApprovalsClient approvals={approvals} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default BookingPage;
