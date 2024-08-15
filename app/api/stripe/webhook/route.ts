import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  const buf = await request.arrayBuffer();
  const sig = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    const bodyBuffer = Buffer.from(buf);
    event = stripe.webhooks.constructEvent(bodyBuffer, sig, process.env.STRIPE_SECRET_WEBHOOK_KEY!);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Webhook signature verification failed:', err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    } else {
      console.error('Webhook signature verification failed with an unknown error');
      return new NextResponse('Webhook Error: An unknown error occurred', { status: 400 });
    }
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata as { userId: string; listingId?: string; startDate?: string; endDate?: string; totalPrice?: string; priceId?: string };

      if (metadata.listingId && metadata.startDate && metadata.endDate && metadata.totalPrice) {
        await prisma.reservation.create({
          data: {
            userId: metadata.userId,
            listingId: metadata.listingId,
            startDate: new Date(metadata.startDate),
            endDate: new Date(metadata.endDate),
            totalPrice: Number(metadata.totalPrice),
            approved: false,
          },
        });
      } else if (metadata.priceId) {
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
      }
      break;
    }

    case 'invoice.payment_succeeded':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          status: subscription.status,
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
      break;
    }

    case 'customer.subscription.deleted': {
      const canceledSubscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: canceledSubscription.id },
        data: {
          status: 'canceled',
        },
      });
      break;
    }

    case 'invoice.payment_failed': {
      const failedInvoice = event.data.object as Stripe.Invoice;
      await prisma.subscription.update({
        where: { stripeSubscriptionId: failedInvoice.subscription as string },
        data: {
          status: 'past_due',
        },
      });
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new NextResponse('Webhook received', { status: 200 });
}
