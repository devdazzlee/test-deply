import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";

interface IParams {
  listingId?: string;
}

// /api/comments/[listingId]

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = params;

    if (!listingId || typeof listingId !== "string") {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    // Fetch all reservations for the current user
    const reservations = await getReservations({ userId: currentUser.id });

    // Check if the user has a reservation for the listing
    const hasReservation = reservations.some(
      reservation => reservation.listingId === listingId
    );

    if (!hasReservation) {
      return NextResponse.json(
        { message: "You can only comment on listings you have reserved." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { text, rating } = body;

    if (text && typeof text !== "string") {
      return NextResponse.json(
        { message: "Invalid comment text" },
        { status: 400 }
      );
    }

    if (rating && (typeof rating !== "number" || rating < 1 || rating > 5)) {
      return NextResponse.json(
        { message: "Invalid rating value" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        text: text || null,
        rating: rating || null,
        userId: currentUser.id,
        listingId,
        createdAt: new Date()
      }
    });

    if (rating) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId }
      });
      if (listing) {
        const newNumberOfRatings = (listing.numberOfRatings || 0) + 1;
        const newAverageRating =
          ((listing.averageRating || 0) * (listing.numberOfRatings || 0) +
            rating) /
          newNumberOfRatings;

        await prisma.listing.update({
          where: { id: listingId },
          data: {
            averageRating: newAverageRating,
            numberOfRatings: newNumberOfRatings
          }
        });
      }
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error("Error posting comment:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
