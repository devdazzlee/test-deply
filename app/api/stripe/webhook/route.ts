import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  const event = await verifyStripeSignature(request);
  if (!event) {
    return new Response('Invalid Signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.payment_succeeded':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse('Webhook received', { status: 200 });
  } catch (error: any) {
    console.error(`Error processing webhook event: ${error.message}`);
    return new Response('Internal Server Error', { status: 500 });
  }
}

/**
 * Verifies the Stripe signature of the incoming request.
 * Returns the parsed Stripe event if the verification is successful, otherwise returns null.
 */
async function verifyStripeSignature(request: NextRequest): Promise<Stripe.Event | null> {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_SECRET_WEBHOOK_KEY!;

  try {
    if (!sig || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret.");
      return null;
    }

    return stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Stripe signature verification failed: ${err.message}`);
    return null;
  }
}

/**
 * Handles 'checkout.session.completed' webhook event.
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata as { 
    userId: string; 
    subscriptionOption?: string;
  };

  if (metadata.subscriptionOption === 'flat_fee') {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    await prisma.user.update({
      where: { id: metadata.userId },
      data: {
        subscriptionOption: 'flat_fee',
        subscriptionExpiresAt: oneYearFromNow,
      },
    });

    await prisma.subscription.create({
      data: {
        userId: metadata.userId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        status: 'active',
        plan: metadata.subscriptionOption!,
        currentPeriodEnd: oneYearFromNow,
      },
    });
  }
}

/**
 * Handles 'customer.subscription.updated' and 'invoice.payment_succeeded' webhook events.
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId;

  if (!userId) {
    console.error('No userId found in subscription metadata');
    return;
  }

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      userId: userId,
      status: subscription.status,
      plan: subscription.items.data[0].price.product as string, // Assuming single price product
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  });
}

/**
 * Handles 'customer.subscription.deleted' webhook event.
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: 'canceled',
    },
  });
}

/**
 * Handles 'invoice.payment_failed' webhook event.
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
  await prisma.subscription.update({
    where: { stripeSubscriptionId: invoice.subscription as string },
    data: {
      status: 'past_due',
    },
  });
}

/**
 * Handles 'account.updated' webhook event.
 * Scenario: This event is triggered when the creator completes Stripe onboarding.
 * - If the onboarding is complete, updates the creator's `stripeOnboardingComplete` field.
 */
async function handleAccountUpdated(account: Stripe.Account) {
  const userId = account.metadata?.userId;

  if (!userId) {
    console.error('No userId found in Stripe account metadata');
    return;
  }

  if (account.capabilities?.transfers === 'active') {
    await prisma.user.update({
      where: { id: userId },
      data: {
        stripeOnboardingComplete: true,
        stripeAccountId: account.id,
      },
    });

    console.log(`Onboarding complete for user with ID: ${userId}, Stripe account: ${account.id}`);
  }
}
