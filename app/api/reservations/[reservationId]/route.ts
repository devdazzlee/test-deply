import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import Email from "@/app/utils/email";
import Stripe from 'stripe';

interface IParams {
  reservationId?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});


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


  if (!res || res.status !== "escrow") {
    return new NextResponse('Reservation not found', { status: 404 });
  }

  const stripeFee = (res.totalPrice * 0.03) * 100 + 30;

  const transfer = await stripe.transfers.create({
    amount: res.totalPrice * 100 + stripeFee,
    currency: 'usd',
    destination: res.userAccount,
    description: `Refund for rejected reservation ${res.id}`,
    transfer_group: res.id,
  });

  const reservation = await prisma.reservation.deleteMany({
    where: {
      id: reservationId,
      OR: [{ userId: currentUser.id }, { listings: { userId: currentUser.id } }]
    }
  });

  if (res && res.user.email && res.user.name) {
    await new Email({ name: res.user.name, email: res.user.email }).sendBookingStatus(false)
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
    return new NextResponse('User not authorised', { status: 504 });
  }

  // Update the reservation to mark it as approved
  const updatedReservation = await prisma.reservation.update({
    where: { id: reservationId },
    data: { approved: true },
    include: { user: true }
  });

  if (updatedReservation && updatedReservation.user.email && updatedReservation.user.name) {
    await new Email({ name: updatedReservation.user.name, email: updatedReservation.user.email }).sendBookingStatus(true)
  }
  return NextResponse.json(updatedReservation);
}
