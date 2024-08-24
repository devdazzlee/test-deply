import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

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
    }
  });

  return NextResponse.json(listing);
}
