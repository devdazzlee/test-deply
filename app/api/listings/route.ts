import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Email from "@/app/utils/email";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId: currentUser.id,
      status: 'active',
    },
  });

  if (!activeSubscription) {
    return NextResponse.json({
      error: 'You must have an active subscription to create a listing',
    }, { status: 403 });
  }

  const body = await request.json();

  const {
    title,
    description,
    imageSrc,
    category,
    experience,
    maxDays,
    minDays,
    location,
    price
  } = body;

  const imageSources = Array.isArray(imageSrc) ? imageSrc : [imageSrc];

  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc: imageSources,
      category,
      experience,
      maxDays,
      minDays,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id
    }
  });
  if (currentUser.email && currentUser.name) {
    new Email({ name: currentUser.name, email: currentUser.email }).sendNewListing()
  }
  return NextResponse.json(listing);
}
