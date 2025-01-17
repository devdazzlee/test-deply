import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getApprovals(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    const query: any = {
      approved: false
    };

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (authorId) {
      query.listings = { userId: authorId };
    }

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        listings: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const safeReservations = reservations.map(reservation => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listings,
        createdAt: reservation.listings.createdAt.toISOString()
      }
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error);
  }
}
