import getCurrentUser from "../actions/getCurrentUser";
import EmptyState from "../components/EmptyState";
import ChatLayout from "./ChatLayout";
import SocketState from "../context/SocketContext";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title='Unauthorised' subtitle='Please login' />;
  }

  return <ChatLayout currentUser={currentUser} />;
}
