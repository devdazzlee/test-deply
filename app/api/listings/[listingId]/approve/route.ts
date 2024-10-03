import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import Email from "@/app/utils/email";

interface IParams {
  listingId?: string;
}

export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== "admin") {
    return NextResponse.json(
      { error: 'Not authorized' },
      { status: 400 }
    );
  }

  const { listingId } = params;

  if (!listingId || typeof listingId != "string") {
    return NextResponse.json(
      { error: 'Invalid ID' },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.update({
    where: {
      id: listingId
    },
    data: {
      approved: true
    },
    include: {
      user: true
    }
  });

  if (listing.user.email && listing.user.name) {
    try {
      new Email({
        name: listing.user.name,
        email: listing.user.email
      }).sendListingStatus(true);
    }
    catch (error) {
      console.log(error);
    }
  }

  return NextResponse.json(listing);
}
