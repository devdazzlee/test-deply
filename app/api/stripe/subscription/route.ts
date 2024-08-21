import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { option } = body; // "flat_fee" or "booking_fee"

  if (option !== "flat_fee" && option !== "booking_fee") {
    return NextResponse.json({ error: "Invalid subscription option" }, { status: 400 });
  }

  if (currentUser.subscriptionOption && new Date() < new Date(currentUser.subscriptionExpiresAt!)) {
    return NextResponse.json({ error: "You already have a locked subscription option." }, { status: 400 });
  }

  // If they choose the flat fee, charge them $299 through Stripe
  if (option === "flat_fee") {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Annual Subscription',
                description: 'One-time payment of $299 for one year of no booking fees.',
              },
              unit_amount: 29900,
            },
            quantity: 1,
          }
        ],
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
        metadata: {
          userId: currentUser.id,
        },
      });

      // Return the session URL to redirect the user to Stripe for payment
      return NextResponse.json({ url: session.url });
    } catch (error) {
      console.error("Error creating Stripe Checkout session:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }

  // If they choose the 5% booking fee, no upfront payment is needed
  // Just update the database
  try {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        subscriptionOption: "booking_fee",
        subscriptionExpiresAt: oneYearFromNow,
      },
    });

    return NextResponse.json({ message: "Subscription option saved" });
  } catch (error) {
    console.error("Error saving subscription option:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
