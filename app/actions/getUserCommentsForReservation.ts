import prisma from "@/app/libs/prismadb";

interface IParams {
  userId: string;
  listingId: string;
}

export default async function getUserCommentsForReservation(params: IParams) {
  try {
    const { userId, listingId } = params;

    const userComments = await prisma.comment.findMany({
      where: {
        userId: userId,
        listingId: listingId,
      },
      select: {
        id: true,
        createdAt: true,
        reservationId: true,
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return userComments;
  } catch (error: any) {
    throw new Error(error);
  }
}
