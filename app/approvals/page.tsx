import getApprovals from "../actions/getApprovals";
import getCurrentUser from "../actions/getCurrentUser";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import ApprovalsClient from "./ApprovalsClient";

const ApprovalsPage = async () => {
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

  if (approvals.length == 0) {
    return (
      <ClientOnly>
        <EmptyState
          title='No requests to approve'
          subtitle="Looks like there aren't any potential bookings yet"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ApprovalsClient reservations={approvals} currentUser={currentUser} />
    </ClientOnly>
  );
};

export default ApprovalsPage;
