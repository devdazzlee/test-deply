import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { buffer } from 'micro';
import prisma from '@/app/libs/prismadb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  const sig = headers().get('stripe-signature') as string;
  const buf = await buffer(request);

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_SECRET_WEBHOOK_KEY!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Process different Stripe event types
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata as { userId: string; priceId: string };
      await prisma.subscription.create({
        data: {
          userId: metadata.userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          status: 'active',
          plan: metadata.priceId,
          currentPeriodEnd: new Date(session.expires_at! * 1000),
        },
      });
      break;

    case 'invoice.payment_succeeded':
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      break;

    case 'customer.subscription.deleted':
      const canceledSubscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: canceledSubscription.id },
        data: {
          status: 'canceled',
        },
      });
      break;

    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: failedInvoice.subscription as string },
        data: {
          status: 'past_due',
        },
      });
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse('Webhook received', { status: 200 });
}
