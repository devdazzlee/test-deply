import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  //UNCOMMENT - CODE TO CHECK IF CREATOR HAS A SUBSCRIPTION BEFORE THEY CAN CREATE A LISTING
  // const activeSubscription = await prisma.subscription.findFirst({
  //   where: {
  //     userId: currentUser.id,
  //     status: 'active',
  //   },
  // });

  // if (!activeSubscription) {
  //   return NextResponse.json({ error: 'You must have an active subscription to create a listing' }, { status: 403 });
  // }

  const body = await request.json();

  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
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
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: currentUser.id
    }
  });

  return NextResponse.json(listing);
}
