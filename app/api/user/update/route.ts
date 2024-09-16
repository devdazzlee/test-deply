import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { passwordScorer } from 'password-scorer';

export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const body = await request.json();
    const { name, email, password } = body;

    let updateData: { name?: string; email?: string; hashedPassword?: string } = {};

    if (name && name !== currentUser.name) {
      updateData.name = name;
    }

    if (email && email.toLowerCase() !== currentUser.email.toLowerCase()) {
      const lowercasedEmail = email.toLowerCase();
      const existingUser = await prisma.user.findUnique({
        where: {
          email: lowercasedEmail,
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: 'Email is already in use' }, { status: 422 });
      }

      updateData.email = lowercasedEmail;
    }

    if (password) {
        const scoreResult = passwordScorer(password);
      
        if (!process.env.ALLOW_WEAK_PASSWORD && scoreResult.score < 60) {
          return NextResponse.json({ error: 'Password is too weak' }, { status: 422 });
        }
      
        const hashedPassword = await bcrypt.hash(password, 12);
        updateData.hashedPassword = hashedPassword;
      }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        ...updateData,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
