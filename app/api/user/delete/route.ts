import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function DELETE() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const userId = currentUser.id;

  try {
    await prisma.$transaction(async (prisma: PrismaClient) => {
      await prisma.account.deleteMany({
        where: {
          userId: userId,
        },
      });

      await prisma.listing.deleteMany({
        where: {
          userId: userId,
        },
      });

      await prisma.reservation.deleteMany({
        where: {
          OR: [
            { userId: userId },
            { receiverId: userId }
          ],
        },
      });

      await prisma.comment.deleteMany({
        where: {
          userId: userId,
        },
      });

      await prisma.subscription.deleteMany({
        where: {
          userId: userId,
        },
      });

      await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    });

    return NextResponse.json({ message: 'User account and all related data deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
