import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret.");
      return new Response('Missing signature or secret', { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata as { 
          userId: string; 
          listingId?: string; 
          startDate?: string; 
          endDate?: string; 
          totalPrice?: string; 
          priceId?: string 
        };

        if (metadata.listingId && metadata.startDate && metadata.endDate && metadata.totalPrice) {
          // Create reservation
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
          // Create subscription
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
  } catch (error: any) {
    console.error(`Error processing webhook event: ${error.message}`);
    return new Response('Internal Server Error', { status: 500 });
  }
}
