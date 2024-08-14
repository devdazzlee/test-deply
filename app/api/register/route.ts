import bcrypt from "bcrypt";
import Email from "@/app/utils/email";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import crypto from "crypto";

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

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
