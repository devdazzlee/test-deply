import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function GET() {
  const currentUser = await getCurrentUser();

  if (!currentUser || !currentUser.stripeAccountId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const payments = await stripe.charges.list({
      limit: 100,
      expand: ['data.balance_transaction'],
    }, {
      stripeAccount: currentUser.stripeAccountId,
    });

    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error('Error retrieving payments:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
