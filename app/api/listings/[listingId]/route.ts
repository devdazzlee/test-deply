import getCurrentUser from "@/app/actions/getCurrentUser";
import Email from "@/app/utils/email";
import { NextResponse } from "next/server";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId != "string") {
    throw new Error("Invalid ID");
  }

  const oldListing = await prisma?.listing.findUnique({
    where: {
      id: listingId,
      // userId: currentUser.id
    },
    include: {
      user: true
    }
  })

  const listing = await prisma?.listing.deleteMany({
    where: {
      id: listingId,
      // userId: currentUser.id
    },
  });

  if (currentUser.role === 'admin') {
    if (oldListing && oldListing.user.email && oldListing.user.name) {
      try {
        await new Email({
          name: oldListing.user.name,
          email: oldListing.user.email
        }).sendListingStatus(false);
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  return NextResponse.json(listing);
}
