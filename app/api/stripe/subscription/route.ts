import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20"
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  // Ensure the user is authenticated
  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const { option } = body; // Option is either "flat_fee" or "booking_fee"

  if (option !== "flat_fee" && option !== "booking_fee") {
    return NextResponse.json(
      { error: "Invalid subscription option" },
      { status: 400 }
    );
  }

  // Check if the user already has an active subscription option
  if (
    currentUser.subscriptionOption &&
    new Date() < new Date(currentUser.subscriptionExpiresAt!)
  ) {
    return NextResponse.json(
      { error: "You already have a locked subscription option." },
      { status: 400 }
    );
  }

  // Handle the flat fee subscription option
  if (option === "flat_fee") {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: "price_1PzRjQLdp37JTmQX7QKZ5CXY",
            quantity: 1
          }
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe`,
        metadata: {
          userId: currentUser.id, // Pass user ID as metadata
          subscriptionOption: option, // Pass subscription option as metadata
          paymentType: "subscription"
        }
      });

      return NextResponse.json({ url: session.url });
    } catch (error) {
      console.error("Error creating Stripe Checkout session:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  // Handle the 5% booking fee subscription option
  if (option === "booking_fee") {
    try {
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          subscriptionOption: "booking_fee",
          subscriptionExpiresAt: oneYearFromNow
        }
      });

      await prisma.subscription.create({
        data: {
          userId: currentUser.id,
          status: "active",
          plan: "booking_fee",
          currentPeriodEnd: oneYearFromNow,
          stripeSubscriptionId: `no_subscription_${new Date()}`
        }
      });

      return NextResponse.json({ message: "Subscription option saved" });
    } catch (error) {
      console.error("Error saving subscription option:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
