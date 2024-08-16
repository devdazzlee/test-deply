import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.stripeAccountId) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 403 });
  }

  try {
    const loginLink = await stripe.accounts.createLoginLink(currentUser.stripeAccountId);

    return NextResponse.json({ url: loginLink.url });
  } catch (error: any) {
    console.error('Error creating Stripe login link:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
