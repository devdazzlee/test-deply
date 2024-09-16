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

  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      verificationToken: token,
    }
  });
  new Email({ email, name }).sendWelcome(token);

  return NextResponse.json(user);
}

/* return NextResponse.json(
  {
    error: "You must have an active subscription to create a listing"
  },
  { status: 403 }
); */
