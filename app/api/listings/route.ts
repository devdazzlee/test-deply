import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import Email from "@/app/utils/email";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }


  if (!process.env.NEXT_PUBLIC_ALLOW_WITHOUT_SUB) {
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: currentUser.id,
        status: "active"
      }
    });

    if (!activeSubscription) {
      return NextResponse.json(
        {
          error: "You must have an active subscription to create a listing"
        },
        { status: 403 }
      );
    }
  }

  const body = await request.json();

  const {
    title,
    bio,
    imageSrc,
    category,
    experience,
    location,
    locationCoords,
    price
  } = body;

  const imageSources = Array.isArray(imageSrc) ? imageSrc : [imageSrc];

  const listing = await prisma.listing.create({
    data: {
      title,
      bio,
      imageSrc: imageSources,
      category,
      experience,
      locationValue: location.value,
      locationCoordinates: locationCoords.latlng,
      price: parseInt(price, 10),
      userId: currentUser.id
    }
  });
  if (currentUser.email && currentUser.name) {
    try {

      await new Email({
        name: currentUser.name,
        email: currentUser.email
      }).sendNewListing();
      if (process.env.ADMIN_EMAIL)
        await new Email({
          name: "Admin",
          email: process.env.ADMIN_EMAIL
        }).sendAdminApproval()
    }
    catch (error) {
      console.log(error);
    }
  }
  return NextResponse.json(listing);
}
