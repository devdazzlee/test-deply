import EmptyState from "../components/EmptyState";
import ClientOnly from "../components/ClientOnly";

import getCurrentUser from "../actions/getCurrentUser";
import BillingClient from "./BillingClient";


const BookingPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title='Unauthorised' subtitle='Please login' />
      </ClientOnly>
    );
  }


  return (
    <ClientOnly>
      <BillingClient currentUser={currentUser} />
    </ClientOnly>
  );
};

export default BookingPage;
