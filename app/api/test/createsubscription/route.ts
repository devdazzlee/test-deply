import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const {
      stripeCustomerId,
      stripeSubscriptionId,
      userId,
      status,
      plan,
      currentPeriodEnd,
    } = await request.json();

    const newSubscription = await prisma.subscription.create({
      data: {
        stripeCustomerId,
        stripeSubscriptionId,
        userId,
        status,
        plan,
        currentPeriodEnd: new Date(currentPeriodEnd),
      },
    });

    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create subscription', details: error.message }, { status: 500 });
  }
}
