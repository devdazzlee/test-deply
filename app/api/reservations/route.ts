import { NextResponse } from "next/server";
import Stripe from 'stripe';
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice } = body;

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      user: true, 
    },
  });

  if (!listing || !listing.user) {
    return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
  }

  const creator = listing.user;

  if (!creator.stripeAccountId) {
    return NextResponse.json({ error: 'Creator does not have a Stripe account.' }, { status: 400 });
  }

  // Always apply a 3% user fee
  const userFee = Math.round(totalPrice * 0.03);

  // If the creator has opted for the 5% booking fee option
  const creatorFee = creator.subscriptionOption === 'booking_fee' ? Math.round(totalPrice * 0.05) : 0;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        // Line item for the base booking price (paid by user)
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: listing.title,
              description: `Booking from ${startDate} to ${endDate}`,
            },
            unit_amount: totalPrice * 100,
          },
          quantity: 1,
        },
        // Line item for the 3% user fee
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Service Fee',
              description: '3% platform service fee',
            },
            unit_amount: userFee * 100, 
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/listings/${listingId}`, 
      payment_intent_data: {
        application_fee_amount: userFee * 100,
        transfer_data: {
          destination: creator.stripeAccountId, // Transfer the remaining amount to the creator
        },
      },
      metadata: {
        userId: currentUser.id,
        listingId,
        startDate,
        endDate,
        totalPrice,
        userFee, 
        creatorFee, // Store the 5% creator fee in metadata for further deduction (if applicable) in the webhook
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
