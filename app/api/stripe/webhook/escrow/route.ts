import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/libs/prismadb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  const event = await verifyStripeSignature(request);
  if (!event) {
    return new NextResponse('Invalid Signature', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch(event.type){
    case "checkout.session.completed":
        return await handlePostNewReservation(session as Stripe.Checkout.Session);

    default:
        // console.log(`Unhandled event type: ${event.type}`);
        return new NextResponse('Unhandled event type', { status: 400 });
  }
}


async function verifyStripeSignature(request: NextRequest): Promise<Stripe.Event | null> {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_ESCROW_WEBHOOK!;
  
    try {
      if (!sig || !webhookSecret) {
        console.error("Missing Stripe signature or webhook secret.");
        return null;
      }
  
      return stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`❌ Stripe signature verification failed: ${err.message}`);
      return null;
    }
}


async function handlePostNewReservation(session: Stripe.Checkout.Session){
    const metadata = session.metadata as {
        userId: string,
        userStripeId: string,
        listingId: string,
        startDate: string,
        endDate: string,
        totalPrice: string,
        userFee: string
    }

    try {
      const listing = await prisma.listing.findUnique({
        where: { id: metadata.listingId },
        include: {
          user: true,
        },
      });

      if (!listing || !listing.user) {
        return new NextResponse('Listing not found', { status: 404 });
      }

      const creator = listing.user;

      const newReservation = await prisma.reservation.create({
        data: {
          listingId: metadata.listingId,
          userId: metadata.userId,
          receiverId: creator.id,
          userAccount: metadata.userStripeId,
          receiverAccount: creator.stripeAccountId!,
          startDate: new Date(metadata.startDate),
          endDate: new Date(metadata.endDate),
          totalPrice: Number(metadata.totalPrice),
          stripePaymentIntentId: session.payment_intent as string,
          status: "escrow",
          approved: false,
        },
      });
        // console.log("New Reservation Created: \n", newReservation);
        return new NextResponse('New Reservation Created', { status: 200 });

    } catch (error) {
        console.error('Error creating reservation from webhook:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// Disable body parser for Stripe security
// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };
