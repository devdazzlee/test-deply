import Stripe from "stripe";
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20"
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  if (currentUser.subscriptionOption === "booking_fee") {
    return NextResponse.json(
      { error: "User Doesn't have Paid Subscription" },
      { status: 404 }
    );
  }

  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: currentUser.id,
        status: "active"
      }
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId!);

    // No need to update the database, as stripe webhook handles it
    return NextResponse.json({
      message: "Subscription cancellation initiated successfully"
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
