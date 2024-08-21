import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import Email from "@/app/utils/email";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId != "string") {
    throw new Error("Invalid ID");
  }

  const res = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { user: true } // Include the user who made the reservation
  });

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listings: { userId: currentUser.id } }]
    }
  });

  if (res && res.user.email && res.user.name) {
    new Email({ name: res.user.name, email: res.user.email }).sendBookingStatus(false)
  }

  return NextResponse.json(reservation);
}

export async function PUT(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  if (!reservationId || typeof reservationId != "string") {
    throw new Error("Invalid ID");
  }

  // Find the reservation with the listing owned by the current user
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { listings: true }
  });

  if (!reservation) {
    throw new Error("Reservation not found"); // Ensures the reservation exists
  }

  if (reservation.listings.userId !== currentUser.id) {
    return NextResponse.rewrite("/unauthorised"); // Checks if the current user is the owner of the listing
  }

  // Update the reservation to mark it as approved
  const updatedReservation = await prisma.reservation.update({
    where: { id: reservationId },
    data: { approved: true },
    include: { user: true }
  });

  if (updatedReservation && updatedReservation.user.email && updatedReservation.user.name) {
    new Email({ name: updatedReservation.user.name, email: updatedReservation.user.email }).sendBookingStatus(true)
  }
  return NextResponse.json(updatedReservation);
}
