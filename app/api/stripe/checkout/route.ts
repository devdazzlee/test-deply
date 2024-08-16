import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  try {
    const { priceId }: { priceId: string } = await request.json();

    if (!priceId || typeof priceId !== 'string') {
      throw new Error('Invalid price ID');
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`, //HANDLE REDIRECTION 
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`, //HANDLE REDIRECTION
      metadata: {
        userId: currentUser.id,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating Stripe Checkout session:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
