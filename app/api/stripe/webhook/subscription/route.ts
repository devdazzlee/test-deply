import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/app/libs/prismadb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  const event = await verifyStripeSignature(request);
  if (!event) {
    return new NextResponse('Invalid Signature', { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch(event.type){    
    case 'checkout.session.completed':
        return await handleSubscriptionCreated(session as Stripe.Checkout.Session);

    default:
        console.log(`Unhandled event type: ${event.type}`);
        return new NextResponse('Unhandled event type', { status: 400 });
  }
}


async function verifyStripeSignature(request: NextRequest): Promise<Stripe.Event | null> {
    const body = await request.text();
    const sig = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK!;
  
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


async function handleSubscriptionCreated(subscription: Stripe.Checkout.Session){
    const metadata = subscription.metadata as { 
        userId: string; 
        subscriptionOption?: string;
        paymentType: string;
      };

      if (metadata.paymentType !== "subscription"){
        return new NextResponse('Not a subscription payment', { status: 501 });
      }

      if (metadata.subscriptionOption !== "flat_fee"){
        return new NextResponse('Flat Fee Subscription Not Found', { status: 404 });
      }

    try {
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

          await prisma.subscription.create({
            data: {
              userId: metadata.userId,
              stripeCustomerId: subscription.customer as string,
              stripeSubscriptionId: subscription.id,
              status: 'active',
              plan: 'flat_fee',
              currentPeriodEnd: oneYearFromNow, 
            },
          });
      
          await prisma.user.update({
            where: { id: metadata.userId },
            data: {
              subscriptionOption: 'flat_fee',
              subscriptionExpiresAt: oneYearFromNow,
            },
          });

          console.error('Flat Fee Subscription Created Successfully');
          return new NextResponse('Flat Fee Subscription Created Successfully', { status: 200 });

    } catch (error) {
        console.error('Error creating subscription from webhook:', error);
        return new NextResponse('Error creating subscription from webhook', { status: 500 });
    }
}