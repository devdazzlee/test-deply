// /app/api/listings/[listingId]/edittitle/title/route.ts

import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PATCH(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { title } = body;

  if (!title) {
    return NextResponse.json(
      { error: "Missing title." },
      { status: 400 }
    );
  }

  try {
    const updatedListing = await prisma.listing.update({
      where: { id: params.listingId },
      data: { title },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing title." },
      { status: 500 }
    );
  }
}
