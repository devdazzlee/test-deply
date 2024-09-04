import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const {
      status,
      senderId,
      receiverId,
      senderAccount,
      receiverAccount,
      amount, 
      bookingId,
      stripePaymentIntentId,
    } = await request.json();

    const newBooking = await prisma.booking.create({
      data: {
        status,
        senderId,
        receiverId,
        senderAccount,
        receiverAccount,
        amount,
        bookingId,
        stripePaymentIntentId,
      },
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create booking', details: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
      const bookings = await prisma.booking.findMany();
      return NextResponse.json(bookings);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch bookings', details: error.message }, { status: 500 });
    }
  }
