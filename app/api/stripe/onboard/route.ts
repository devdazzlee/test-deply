import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  try {
    let stripeAccountId = currentUser.stripeAccountId;

    // Check if the user already has a Stripe account
    if (!stripeAccountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: currentUser.email!,
        business_type: 'individual',
        country: 'US', // adjust this based on your target market
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          userId: currentUser.id, 
        },
      });

      // Update user in the database with the created Stripe account ID
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          stripeAccountId: account.id,
        },
      });

      stripeAccountId = account.id;
    }

    // Create an account link for the onboarding flow
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/reauthenticate`, // URL to redirect if they need to restart the onboarding process
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`, // URL to redirect upon successful onboarding
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error('Error creating Stripe account:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
