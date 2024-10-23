import getCurrentUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import EmptyState from "../components/EmptyState";
import ProfileClient from "./ProfileClient";
import prisma from "@/app/libs/prismadb";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <EmptyState title='Unauthorised' subtitle='Please login' />;
  }

  const listings = await getListings({ userId: currentUser.id });

  return <ProfileClient currentUser={currentUser} listings={listings} />;
}
