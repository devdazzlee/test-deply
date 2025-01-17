import bcrypt from "bcryptjs";
import Email from "@/app/utils/email";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import crypto from "crypto";

import { passwordScorer } from 'password-scorer';

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "This email is already registered. Please log in." },
      { status: 409 } // Conflict status code
    );
  }
  let scoreResult = passwordScorer(password);

  if (!process.env.ALLOW_WEAK_PASSWORD) {
    if (scoreResult.score < 60) {
      return NextResponse.json(
        {
          error: "Password is too weak"
        },
        { status: 422 /* Unprocessable Entity */ }
      );
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const token = generateVerificationToken();

  const lowercasedEmail = email.toLowerCase();
  const user = await prisma.user.create({
    data: {
      email: lowercasedEmail,
      name,
      hashedPassword,
      verificationToken: token,
    }
  });

  try {
    await new Email({ email: lowercasedEmail, name }).sendWelcome(token);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json(user);
}

/* return NextResponse.json(
  {
    error: "You must have an active subscription to create a listing"
  },
  { status: 403 }
); */
