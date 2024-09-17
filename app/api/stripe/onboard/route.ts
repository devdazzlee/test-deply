import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import Email from '@/app/utils/email';

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
        country: 'US', // Adjust based on your target market
        email: currentUser.email!,
        controller: {
          fees: {
            payer: 'application',
          },
          losses: {
            payments: 'application',
          },
          stripe_dashboard: {
            type: 'express',
          },
        },
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          userId: currentUser.id,
        },
      });

      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          stripeAccountId: account.id,
          stripeOnboardingComplete: true
        },
      });

      stripeAccountId = account.id;
    }

    // Generate the onboarding link for Stripe Express
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`, // URL to redirect if they need to restart the onboarding process
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`, // URL to redirect upon successful onboarding
      type: 'account_onboarding',
    });

    if (currentUser.email && currentUser.name) {
      try {
        new Email({
          name: currentUser.name,
          email: currentUser.email
        }).sendStripeOnBoarding()
      } catch (error) {
        console.log(error);
      }
    }

    return NextResponse.json({ url: accountLink.url });
  } catch (error: any) {
    console.error('Error creating Stripe account:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
