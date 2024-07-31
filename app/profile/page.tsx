import getCurrentUser from "../actions/getCurrentUser";
import EmptyState from "../components/EmptyState";
import ProfileClient from "./ProfileClient";
import prisma from "@/app/libs/prismadb";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title='Unauthorised' subtitle='Please login' />;
  }

  let listing = await prisma?.listing.findFirst({
    where: { userId: currentUser.id }
  });

  return <ProfileClient currentUser={currentUser} listing={listing} />;
}
