import prisma from "@/app/libs/prismadb";
import getUserCommentsForReservation from "./getUserCommentsForReservation";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  userId: string;
  listingId: string;
}

export default async function getUnreviewedReservations(params: IParams) {
  const { userId, listingId } = params;

  try {
    const reservations = await getReservations({ userId });

    const listingReservations = reservations.filter(
      (reservation: any) => reservation.listingId === listingId
    );

    const userComments = await getUserCommentsForReservation({ userId, listingId });

    const commentedReservationIds = userComments.map((comment: any) => comment.reservationId);

    const unreviewedReservations = listingReservations.filter(
      (reservation: any) => !commentedReservationIds.includes(reservation.id)
    );

    return unreviewedReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
