import getCurrentUser from "@/app/actions/getCurrentUser";
import ProfileClient from "./ProfileClient";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";

const ProfilePage = async () => {
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
      {" "}
      <ProfileClient currentUser={currentUser} />{" "}
    </ClientOnly>
  );
};

export default ProfilePage;
