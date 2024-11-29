import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { listingId: string } }
) {
  const { listingId } = params;

  try {
    const { available } = await req.json();

    // Validate input
    if (!listingId || typeof available !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Update the listing
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: { available },
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error) {
    console.error("Error updating listing availability:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
