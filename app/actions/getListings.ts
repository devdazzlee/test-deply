import prisma from "@/app/libs/prismadb";

export interface IListingsParams {
  userId?: string;
  experience?: number;
  averageRating?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
  user?: Object;
}

export default async function getListings(
  params: IListingsParams,
  opts?: { approvalFilter?: "all" | "approved" | "unapproved" }
) {
  try {
    const {
      userId,
      experience,
      averageRating,
      startDate,
      endDate,
      locationValue,
      category
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {

      const catArr = category.split(",");

      query.category = {
        hasSome: catArr // Prisma operator to check for any match in the array
      };
    }

    if (experience) {
      query.experience = {
        gte: +experience
      };
    }


    if (averageRating) {
      query.averageRating = {
        gte: +averageRating
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }
    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate }
              }
            ]
          }
        }
      };
    }

    let approvalFilter = opts?.approvalFilter || "all";
    let filter = {};
    switch (approvalFilter) {
      case "all":
        break;

      case "approved":
        filter = {
          approved: true
        };
        break;

      case "unapproved":
        filter = {
          approved: false,
        };
        break;
    }

    const listings = await prisma.listing.findMany({
      where: {
        ...query,
        ...filter
      },
      orderBy: {
        createdAt: "desc"
      },
      include: {
        user: {
          select: {
            name: true,
            image: true
          }
        }
      }
    });

    const safeListings = listings.map(listings => ({
      ...listings,
      createdAt: listings.createdAt.toISOString()
    }));

    return safeListings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
}
