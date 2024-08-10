import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getSubscriptionStatus() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: currentUser.id,
        status: 'active',
      },
      orderBy: {
        createdAt: "desc", // Get the most recent active subscription
      },
    });

    if (!subscription) {
      return null;
    }

    return {
      ...subscription,
      createdAt: subscription.createdAt.toISOString(),
      updatedAt: subscription.updatedAt.toISOString(),
      currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch subscription status');
  }
}
