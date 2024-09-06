import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
    reservationId?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function PUT(request: NextRequest, { params }: { params: IParams }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { reservationId } = params;

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });

    if (!reservation || reservation.status !== "escrow") {
      return new NextResponse('Reservation not found', { status: 404 });
    }

    if (reservation.userId !== currentUser.id) {
        return NextResponse.rewrite("/unauthorised");
    }

    const transfer = await stripe.transfers.create({
      amount: reservation.totalPrice * 100,
      currency: 'usd',
      destination: reservation.receiverAccount,
      description: `Payment for reservation ${reservation.id}`,
      transfer_group: reservation.id,
    });

    await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: 'completed',
      },
    });

    return new NextResponse('Transfer successful and reservation updated', { status: 200 });
  } catch (error: any) {
    console.error('Error processing transfer:', error.message);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
