// Importing required modules
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { passwordScorer } from 'password-scorer';

export async function PATCH(request: NextRequest) {
  try {
    // Get the current user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    // Parse the request body
    const body = await request.json();
    console.log("Request body: >>>>>>> ", body);
    const { name, email, password, town, bio, facebook, instagram, linkedin } = body;

    // Define an empty object to hold the updates
    let updateData: {
      name?: string;
      email?: string;
      hashedPassword?: string;
      town?: string;
      bio?: string;
      facebook?: string;
      instagram?: string;
      linkedin?: string;
    } = {};

    // Update user's name if it has changed
    if (name && name !== currentUser.name) {
      updateData.name = name;
    }

    // Update user's email if it has changed and ensure the email is unique
    if (email) {
      const lowercasedEmail = email.toLowerCase();
      const currentEmail = currentUser.email?.toLowerCase() || '';

      if (lowercasedEmail !== currentEmail) {
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
    }

    // Update password if provided and meets criteria
    if (password) {
      const scoreResult = passwordScorer(password);

      if (!process.env.ALLOW_WEAK_PASSWORD && scoreResult?.score < 60) {
        return NextResponse.json({ error: 'Password is too weak' }, { status: 422 });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      updateData.hashedPassword = hashedPassword;
    }

    // Add town, bio, facebook, instagram, linkedin fields to the updateData object if they are different
    if (typeof town === 'string' && town !== currentUser.town && town !== null) {
      updateData.town = town;
    }

    if (typeof bio === 'string' && bio !== currentUser.bio) {
      updateData.bio = bio;
    }

    if (typeof facebook === 'string' && facebook !== currentUser.facebook) {
      updateData.facebook = facebook;
    }

    if (typeof instagram === 'string' && instagram !== currentUser.instagram) {
      updateData.instagram = instagram;
    }

    if (typeof linkedin === 'string' && linkedin !== currentUser.linkedin) {
      updateData.linkedin = linkedin;
    }

    // Update the user in the database
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
    console.error("Error in PATCH handler:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}