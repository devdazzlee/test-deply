import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}

export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json(
      { error: "Invalid listing ID" },
      { status: 400 }
    );
  }

  const body = await request.json();
  const { imageSrc } = body;

  if (!Array.isArray(imageSrc)) {
    return NextResponse.json(
      { error: "Invalid imageSrc array" },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId }
  });

  if (!listing || listing.userId !== currentUser.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: { imageSrc }
  });

  return NextResponse.json(updatedListing);
}
