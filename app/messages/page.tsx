import getCurrentUser from "../actions/getCurrentUser";
import EmptyState from "../components/EmptyState";
import ChatLayout from "./ChatLayout";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title='Unauthorised' subtitle='Please login' />;
  }

  return <ChatLayout />;
}
