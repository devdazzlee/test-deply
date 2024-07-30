import getCurrentUser from "../actions/getCurrentUser";
import EmptyState from "../components/EmptyState";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title='Unauthorised' subtitle='Please login' />;
  }

  return <ProfileClient currentUser={currentUser} />;
}
