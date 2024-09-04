import { NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const {
      title,
      description,
      imageSrc,
      category,
      experience,
      maxDays,
      minDays,
      locationValue,
      userId,
      price,
      averageRating = 0.0,
      numberOfRatings = 0,
      approved = false,
    } = await request.json();

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        experience,
        maxDays,
        minDays,
        locationValue,
        userId,
        price,
        averageRating,
        numberOfRatings,
        approved,
      },
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create listing', details: error.message }, { status: 500 });
  }
}

export async function GET() {
    try {
      const listings = await prisma.listing.findMany();
      return NextResponse.json(listings);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch listings', details: error.message }, { status: 500 });
    }
  }
