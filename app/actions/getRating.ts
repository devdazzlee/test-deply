import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getRatings(
  params: IParams
) {
  try {
    const { listingId } = params;

    if (!listingId) {
      throw new Error("Listing ID is required");
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: {
        id: true,
        title: true,
        averageRating: true,
        numberOfRatings: true,
        comments: {
          select: {
            rating: true,
          },
          where: {
            rating: {
              not: null,
            }
          }
        }
      }
    });

    if (!listing) {
      throw new Error("Listing not found");
    }

    const ratings = listing.comments.map(comment => comment.rating);

    return {
      listingId: listing.id,
      title: listing.title,
      averageRating: listing.averageRating,
      numberOfRatings: listing.numberOfRatings,
      ratings: ratings,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
