import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
}

export default async function getComments(params: IParams) {
  try {
    const { listingId, userId } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    const comments = await prisma.comment.findMany({
      where: query,
      include: {
        user: true,
        listing: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    const safeComments = comments.map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      user: {
        ...comment.user,
        createdAt: comment.user.createdAt.toISOString(),
        updatedAt: comment.user.updatedAt.toISOString(),
      },
      listing: {
        ...comment.listing,
        createdAt: comment.listing.createdAt.toISOString()
      }
    }));

    return safeComments;
  } catch (error: any) {
    throw new Error(error);
  }
}
